import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserById } from "../models/users.js";

// Whenever you want to use passport you have to create a strategy
const strategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    // First parameter in done is always the error, if there was no error pass null
    // Second parameter means that there was no error, but you give a boolean value if passport was able to authenticate
    // third parameter is if you actually found it, then you should return the user
    try {
      const user = findUserByEmail(email);
      if (!user) {
        //Case 2: User not found or password incorrect
        // no error so return null, but the user was not authenticated since incorrect info so return false
        done(null, false, { message: "User or password incorrect" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        //Case 2: User not found or password incorrect
        // no error so return null, but the user was not authenticated since incorrect info so return false
        done(null, false, { message: "User or password incorrect" });
      }

      // Case 3: User was found and password correct
      // no error so return null, user was found so return the user
      delete user.passwordHash;
      return done(null, user);
    } catch (error) {
      // Case 1: There is an error
      // only return the error
      done(error);
    }
  }
);

// then you have to give passport the strategy that you want to use
passport.use(strategy);

// Serialize user (This is what we want to store in the session so we want to ensure that we are serializing it)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize a user (how to retrieve a user from a session)
passport.deserializeUser((id, done) => {
  try {
    const user = findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
