import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  approved: { type: Boolean, default: false },
  allowedPages: [String], // This will store the specific pages/files the user can access
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

const User = mongoose.model("Users", userSchema);

export default User;
