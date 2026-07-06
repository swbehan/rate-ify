import { connect } from "./config.js";
import bcrypt from "bcrypt";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

function UsersCollection({ collectionName = "users" } = {}) {
  const me = {};

  const users = connect(collectionName);

  // Register a new user: reject duplicates, hash the password, then insert.
  // Returns a clean object (never the passwordHash) on success, or null if the
  // email is already taken (the route maps that to a 400).
  me.registerUser = async ({ email, password, name }) => {
    try {
      const existingUser = await me.findUserByEmail(email);
      if (existingUser) {
        return null;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUserDoc = {
        email,
        passwordHash,
        name,
        createdAt: new Date(),
      };
      const result = await users.insertOne(newUserDoc);
      console.log("Registered new User in MongoDB 📝");
      return { id: result.insertedId, email, name };
    } catch (error) {
      console.error("Error registering new User", error);
      throw error;
    }
  };

  // Returns the full user document (including passwordHash) or null.
  // The hash is needed by passport to compare passwords, so we don't strip it here.
  me.findUserByEmail = async (email) => {
    try {
      return await users.findOne({ email });
    } catch (error) {
      console.error("Error finding user by email", error);
      throw error;
    }
  };

  // Guard against a malformed id string before asking Mongo for an ObjectId.
  me.findUserById = async (id) => {
    try {
      if (!ObjectId.isValid(id)) return null;
      return await users.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error finding user by id", error);
      throw error;
    }
  };

  me.getAllUsers = async () => {
    try {
      return await users.find({}).toArray();
    } catch (error) {
      console.error("Error fetching all users", error);
      throw error;
    }
  };

  return me;
}

const usersCollection = UsersCollection();
export default usersCollection;
