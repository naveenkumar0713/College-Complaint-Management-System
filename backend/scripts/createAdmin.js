
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.name = process.env.ADMIN_NAME;
    existingAdmin.password = hashedPassword;
    existingAdmin.role = "admin";

    await existingAdmin.save();

    console.log("Admin account updated");
  } else {
    await User.create({
      name: process.env.ADMIN_NAME,
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
