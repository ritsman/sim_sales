import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  image: String, // Store Base64 image
});

export const GalleryImages = mongoose.model("GalleryImages", imageSchema);