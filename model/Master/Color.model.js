import mongoose from "mongoose";

// Define Mongoose Schema and Model
const ColorSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  hex: { type: String, required: true },
});

const Color = mongoose.model("Color", ColorSchema);

export default Color;
