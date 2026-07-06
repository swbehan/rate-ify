import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { findUserByEmail, createUser } from "../models/users.js";
import { isAuthenticated } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "All fields are required to register" });
    }

    // check if the user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = createUser({
      email,
      passwordHash: hashedPassword,
      name,
    });

    // dont send the password back
    delete user.password;

    res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// with the passport, we will use express middleware instead of the (req, res) arrow function
// creates a middle ware, an iterception of the flow of the requests
authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/about",
  })
);

// get the current user (protected route)
// Returns the current user if the user is authenticated
authRouter.get("/user", isAuthenticated, (req, res) => {
  delete req.user.passwordHash;
  res.json({ user: req.user });
});

//log out endpoint, will log the user out and now when you try to get the current user with user in the request body, it will say not authenticated
// which comes from the middleware auth.js
authRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    res.json({message:"Logout successful"});
  });
});

export default authRouter;
