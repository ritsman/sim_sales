// models/Collection.js
import mongoose from "mongoose";

const skuCollection = new mongoose.Schema({
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

const SKUCollection = mongoose.model("skuCollection", skuCollection);
export default SKUCollection;



const skuProductCollection = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
  skuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "skuCollection",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to prevent duplicate associations
skuProductCollection.index({ productId: 1 }, { unique: true });

export const SKUProduct = mongoose.model(
  "skuProduct",
  skuProductCollection
);

