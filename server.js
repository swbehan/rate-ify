import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import reviewsRouter from "./routes/reviews.js";
import authRouter from "./routes/Auth.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: "super-secret-key-shhh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
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
