import { Router } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/users.js";

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

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invaild email or password" });
    }

    delete user.password;

    res
      .status(200)
      .json({ message: "Login successful", user: user });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export default authRouter;