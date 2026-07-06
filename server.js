import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { CLIENT, DB_NAME } from "./db/config.js";
import passport from "./config/passport.js";
import reviewsRouter from "./routes/reviews.js";
import authRouter from "./routes/Auth.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// In production the app runs behind a reverse proxy (Render/Railway/Nginx/etc.)
// that terminates HTTPS. Trusting the proxy lets Express see the request as
// secure, so `cookie.secure: true` actually sends the session cookie.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Persist sessions in MongoDB (reusing the existing client / connection pool)
    // so logins survive server restarts and deploys, instead of the default
    // in-memory store that is wiped on every restart.
    store: MongoStore.create({
      client: CLIENT,
      dbName: DB_NAME,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // seconds — expired sessions are cleaned up automatically
    }),
    cookie: {
      // Only send the cookie over HTTPS in production; stays off in dev so
      // it still works on http://localhost.
      secure: process.env.NODE_ENV === "production",
      // JS in the browser can't read the cookie — mitigates XSS token theft.
      httpOnly: true,
      // Don't send the cookie on cross-site requests — mitigates CSRF.
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static("./frontend/dist"));
app.use("/api", reviewsRouter);
app.use("/api/auth", authRouter);

// Catch-all route for Single Page Application (SPA) routing.
// If a user refreshes or types a route path directly into the browser URL bar,
// it bypasses React Router and hits our server directly. This wildcard route
// ensures we always serve 'index.html', allowing React to load in the browser,
// read the URL path, and render the correct component (like /about).
app.get("*splat", function (req, res) {
  res.sendFile("index.html", {
    root: join(__dirname, "./frontend/dist"),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
