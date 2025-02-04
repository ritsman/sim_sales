import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  user: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
});

const User = mongoose.model("Users", userSchema);

export default User;
