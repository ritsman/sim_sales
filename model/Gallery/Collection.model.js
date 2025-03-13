// models/Collection.js
import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection



const ProductCollectionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to prevent duplicate associations
ProductCollectionSchema.index(
  { productId: 1, collectionId: 1 },
  { unique: true }
);

export const ProductCollection = mongoose.model("ProductCollection", ProductCollectionSchema);
