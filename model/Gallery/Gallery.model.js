import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const imageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // URL of uploaded image
    category: { type: String, required: true },
    styleName: { type: String, required: true },

    color: { type: String, required: true },
    sizes: [SizeSchema],
    price: { type: Number, required: true },
    // imageUrl: { type: String, required: true },
    // category: { type: String },
    // color: { type: String },
    // sizes: { type: String },
    // quantity: { type: String },
    // price: { type: String },
  },
  { timestamps: true }
);

export const GalleryImages = mongoose.model("GalleryImages", imageSchema);