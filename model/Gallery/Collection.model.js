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

const ProductCollection = mongoose.model("ProdCollection", CollectionSchema);
export default ProductCollection;



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

export const ProductFromCollection = mongoose.model("ProductFromCollection", ProductCollectionSchema);






const ItemCollectionSchema = new mongoose.Schema({
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

export const ItemCollection = mongoose.model("ItemCollection", ItemCollectionSchema);
  



const ItemFromCollectionSchema = new mongoose.Schema({
  itemId: {
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
ItemFromCollectionSchema.index(
  { itemId: 1, collectionId: 1 },
  { unique: true }
);

export const ItemFromCollection = mongoose.model("ItemFromCollection", ItemFromCollectionSchema);
