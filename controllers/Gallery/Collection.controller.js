import Collection from "../../model/Gallery/Collection.model.js"
import { ProductCollection } from "../../model/Gallery/Collection.model.js"

export const getCollection = async(req,res)=>{
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const createCollection = async(req,res)=>{
 try {
   const { name } = req.body;

   if (!name) {
     return res.status(400).json({ message: "Collection name is required" });
   }

   // Check if collection with same name exists
   const existingCollection = await Collection.findOne({ name });
   if (existingCollection) {
     return res
       .status(400)
       .json({ message: "Collection with this name already exists" });
   }

   const newCollection = new Collection({ name });
   await newCollection.save();

   res.status(201).json(newCollection);
 } catch (error) {
   console.error("Error creating collection:", error);
   res.status(500).json({ message: "Server error" });
 }
}

export const updateCollection = async(req,res)=>{
 try {
   const { name } = req.body;

   if (!name) {
     return res.status(400).json({ message: "Collection name is required" });
   }

   const collection = await Collection.findById(req.params.id);
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
}

export const deleteCollection = async(req,res)=>{
 try {
   const collection = await Collection.findById(req.params.id);
   if (!collection) {
     return res.status(404).json({ message: "Collection not found" });
   }

   // Delete all product associations with this collection
   await ProductCollection.deleteMany({ collectionId: req.params.id });

   // Delete the collection
   await Collection.findByIdAndDelete(req.params.id);

   res.json({ message: "Collection deleted successfully" });
 } catch (error) {
   console.error("Error deleting collection:", error);
   res.status(500).json({ message: "Server error" });
 }
}

export const addProductCollection = async(req,res)=>{
  try {
    const { productId, collectionId } = req.body;

    if (!productId || !collectionId) {
      return res
        .status(400)
        .json({ message: "Product ID and Collection ID are required" });
    }

    // Check if association already exists
    const existingAssociation = await ProductCollection.findOne({
      productId,
      collectionId,
    });

    if (existingAssociation) {
      return res
        .status(400)
        .json({ message: "Product is already in this collection" });
    }

    const newAssociation = new ProductCollection({
      productId,
      collectionId,
    });

    await newAssociation.save();

    res.status(201).json(newAssociation);
  } catch (error) {
    console.error("Error adding product to collection:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getProductCollection = async(req,res)=>{
 try {
   const productCollections = await ProductCollection.find();
   res.json(productCollections);
 } catch (error) {
   console.error("Error fetching product collections:", error);
   res.status(500).json({ message: "Server error" });
 }
}

export const removeProductCollection = async(req,res)=>{
  try {
    const { productId, collectionId } = req.body;

    if (!productId || !collectionId) {
      return res
        .status(400)
        .json({ message: "Product ID and Collection ID are required" });
    }

    const result = await ProductCollection.findOneAndDelete({
      productId,
      collectionId,
    });

    if (!result) {
      return res.status(404).json({ message: "Association not found" });
    }

    res.json({ message: "Product removed from collection successfully" });
  } catch (error) {
    console.error("Error removing product from collection:", error);
    res.status(500).json({ message: "Server error" });
  }

}