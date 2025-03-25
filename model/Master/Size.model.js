import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    sizeName: { type: String, required: true },
    sizes: { type: [String], required: true }, // Array of size values
  },
  { timestamps: true }
);

const Size = mongoose.model("size", sizeSchema);

export default Size;
