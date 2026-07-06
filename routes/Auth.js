import { Router } from "express";
import passport from "passport";
import usersCollection from "../db/users-db.js";
import { isAuthenticated } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation (HTTP-level concern, so it stays in the route)
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "All fields are required to register" });
    }

    // Delegate the duplicate check + hashing + insert to the users db object.
    const user = await usersCollection.registerUser({ email, password, name });
    if (!user) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error registering user", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Login with a custom passport callback so we can return JSON (for the SPA)
// instead of doing server-side redirects. The callback receives the result of
// the "local" strategy: (err, user, info).
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Bad email/password — `info.message` comes from the strategy's done(...).
      return res
        .status(401)
        .json({ message: info?.message || "Invalid credentials" });
    }
    // Establish the login session (this is what serializeUser hooks into).
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        user: { id: user._id, email: user.email, name: user.name },
      });
    });
  })(req, res, next);
});

// get the current user (protected route)
// Returns the current user if the user is authenticated
authRouter.get("/user", isAuthenticated, (req, res) => {
  const noPasswordUser = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.json({ user: noPasswordUser });
});

//log out endpoint, will log the user out and now when you try to get the current user with user in the request body, it will say not authenticated
// which comes from the middleware auth.js
authRouter.post("/logout", (req, res) => {
  // 1. Clear the login info from the session (passport 0.6+ requires the callback).
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    // 2. Destroy the whole session document in the Mongo store.
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Logout failed", error: err.message });
      }
      // 3. Tell the browser to drop the session cookie, then confirm.
      //    The React app handles navigation client-side on this response.
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
});

export default authRouter;
