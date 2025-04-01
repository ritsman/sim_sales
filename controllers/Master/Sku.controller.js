import SKUCollection from "../../model/Master/Sku.model.js";
import { SKUProduct } from "../../model/Master/Sku.model.js";


export const getSkuCollection = async (req, res) => {
  try {
    const collections = await SKUCollection.find();
    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createSkuCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    // Check if collection with same name exists
    const existingCollection = await SKUCollection.findOne({ name });
    if (existingCollection) {
      return res
        .status(400)
        .json({ message: "Collection with this name already exists" });
    }

    const newCollection = new SKUCollection({ name });
    await newCollection.save();

    res.status(201).json(newCollection);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSkuCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    const collection = await SKUCollection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.name = name;
    await collection.save();

    res.json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSkuCollection = async (req, res) => {
  try {
    const collection = await SKUCollection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Delete all product associations with this collection
    await SKUProduct.deleteMany({ collectionId: req.params.id });

    // Delete the collection
    await SKUCollection.findByIdAndDelete(req.params.id);

    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addSkuProduct = async (req, res) => {
  try {
    const { productId, skuId } = req.body;

    if (!productId || !skuId) {
      return res
        .status(400)
        .json({ message: "Product ID and Collection ID are required" });
    }

    // Check if the product is already assigned to any SKU collection
    const existingAssociation = await SKUProduct.findOne({ productId });

    if (existingAssociation) {
      return res.status(400).json({
        message: "You cannot add the same product to multiple SKU collections",
      });
    }

    // If not assigned, create a new association
    const newAssociation = new SKUProduct({ productId, skuId });
    await newAssociation.save();

    res
      .status(201)
      .json({
        message: "Product successfully added to collection",
        newAssociation,
      });
  } catch (error) {
    console.error("Error adding product to collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSkuProduct = async (req, res) => {
  try {
    const productCollections = await SKUProduct.find();
    res.json(productCollections);
  } catch (error) {
    console.error("Error fetching product collections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeSkuProduct = async (req, res) => {
  try {
    const { productId, skuId } = req.body;

    if (!productId || !skuId) {
      return res
        .status(400)
        .json({ message: "Product ID and Collection ID are required" });
    }

    const result = await SKUProduct.findOneAndDelete({
      productId,
      skuId,
    });

    if (!result) {
      return res.status(404).json({ message: "Association not found" });
    }

    res.json({ message: "Product removed from collection successfully" });
  } catch (error) {
    console.error("Error removing product from collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};


