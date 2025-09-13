import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import connect from "../lib/databaseconnect";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  await connect();

  const username = process.env.ADMIN_USERNAME || "admin";
  const plainPassword = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin User";
  const role = "admin";

  if (!plainPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set.");
    mongoose.disconnect();
    process.exit(1);
  }

  // Check if admin user already exists
  const existing = await User.findOne({ username });
  if (existing) {
    // Update password and other details
    existing.password = await bcrypt.hash(plainPassword, 10);
    existing.name = name;
    existing.role = role;
    await existing.save();
    console.log("Admin user updated!");
    mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = new User({
    username,
    password: hashedPassword,
    name,
    role,
  });

  await user.save();
  console.log("Admin user created!");
  mongoose.disconnect();
}

createAdmin();
