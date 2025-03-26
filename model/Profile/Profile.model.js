import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  pin: String,
  email: String,
  phone: String,
});

export const Profile = mongoose.model("Profile", profileSchema);
