import ProdCollection from "../../model/Gallery/Collection.model.js"
import { ProductFromCollection } from "../../model/Gallery/Collection.model.js"
import { ItemCollection } from "../../model/Gallery/Collection.model.js";
import { ItemFromCollection } from "../../model/Gallery/Collection.model.js";

export const getCollection = async(req,res)=>{
  try {
    const collections = await ProdCollection.find();
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
   const existingCollection = await ProdCollection.findOne({ name });
   if (existingCollection) {
     return res
       .status(400)
       .json({ message: "Collection with this name already exists" });
   }

   const newCollection = new ProdCollection({ name });
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

   const collection = await ProdCollection.findById(req.params.id);
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
   const collection = await ProdCollection.findById(req.params.id);
   if (!collection) {
     return res.status(404).json({ message: "Collection not found" });
   }

   // Delete all product associations with this collection
   await ProductFromCollection.deleteMany({ collectionId: req.params.id });

   // Delete the collection
   await ProdCollection.findByIdAndDelete(req.params.id);

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
    const existingAssociation = await ProductFromCollection.findOne({
      productId,
      collectionId,
    });

    if (existingAssociation) {
      return res
        .status(400)
        .json({ message: "Product is already in this collection" });
    }

    const newAssociation = new ProductFromCollection({
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
   const productCollections = await ProductFromCollection.find();
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

    const result = await ProductFromCollection.findOneAndDelete({
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


//item collection 
export const getItemCollection = async (req, res) => {
  try {
    const collections = await ItemCollection.find();
    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createItemCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    // Check if collection with same name exists
    const existingCollection = await ItemCollection.findOne({ name });
    if (existingCollection) {
      return res
        .status(400)
        .json({ message: "Collection with this name already exists" });
    }

    const newCollection = new ItemCollection({ name });
    await newCollection.save();

    res.status(201).json(newCollection);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateItemCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    const collection = await ItemCollection.findById(req.params.id);
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

export const deleteItemCollection = async (req, res) => {
  try {
    const collection = await ItemCollection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Delete all product associations with this collection
    await ItemFromCollection.deleteMany({ collectionId: req.params.id });

    // Delete the collection
    await ItemCollection.findByIdAndDelete(req.params.id);

    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addItemToCollection = async (req, res) => {
  try {
    const { itemId, collectionId } = req.body;

    if (!itemId || !collectionId) {
      return res
        .status(400)
        .json({ message: "Product ID and Collection ID are required" });
    }

    // Check if association already exists
    const existingAssociation = await ItemFromCollection.findOne({
      itemId,
      collectionId,
    });

    if (existingAssociation) {
      return res
        .status(400)
        .json({ message: "Product is already in this collection" });
    }

    const newAssociation = new ItemFromCollection({
      itemId,
      collectionId,
    });

    await newAssociation.save();

    res.status(201).json(newAssociation);
  } catch (error) {
    console.error("Error adding product to collection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getItemFromCollection = async (req, res) => {
  try {
    const productCollections = await ItemFromCollection.find();
    res.json(productCollections);
  } catch (error) {
    console.error("Error fetching product collections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeItemFromCollection = async (req, res) => {
  try {
    const { itemId, collectionId } = req.body;

    if (!itemId || !collectionId) {
      return res
        .status(400)
        .json({ message: "Product ID and Collection ID are required" });
    }

    const result = await ItemFromCollection.findOneAndDelete({
      itemId,
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
};

