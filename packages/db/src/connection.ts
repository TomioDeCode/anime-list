import mongoose from "mongoose";
import { config } from "./config";

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodb.url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB", error);
    process.exit(1);
  }
}

export { mongoose };
