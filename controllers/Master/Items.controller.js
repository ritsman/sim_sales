import Item from "../../model/Master/Items.model.js"
import { ItemStocks } from "../../model/Master/Items.model.js";


export const createItems = async(req,res)=>{
    console.log(req.files,"files",req.body);
 try {
    const newItem = new Item({
      ...req.body,
      image: req.files ? `/uploads/${req.files.image[0].filename}` : null, // Store image path
    });

    const savedItem = await newItem.save();
   res.status(201).json(savedItem);
 } catch (error) {
    console.log(error)
   res.status(500).json({ message: "Error creating item", error });
 }
}

export const updateItems = async(req,res)=>{
        const { id } = req.params;

     const existingProduct = await Item.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    let updateData = {...req.body};
     if (req.files) {
        updateData.image = req.files?.image
          ? `/uploads/${req.files.image[0].filename}`
          : existingProduct.image;

     }
 try {
   const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, {
     new: true,
     runValidators: true,
   });

   if (!updatedItem) {
     return res.status(404).json({ message: "Item not found" });
   }

   res.status(200).json(updatedItem);
 } catch (error) {
   res.status(500).json({ message: "Error updating item", error });
 }
}

export const getItems = async(req,res)=>{
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
}

export const deleteItems = async (req, res) => {
  try {
    const { itemIds } = req.body; // Expecting an array of item IDs

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid request. No items provided for deletion." });
    }

    const deletedItems = await Item.deleteMany({ _id: { $in: itemIds } });

    if (deletedItems.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No matching items found for deletion." });
    }

    res
      .status(200)
      .json({
        message: "Items deleted successfully",
        deletedCount: deletedItems.deletedCount,
      });
  } catch (error) {
    res.status(500).json({ message: "Error deleting items", error });
  }
};


export const addItemStocks = async(req,res)=>{
    try {
      const stockEntries = req.body; // Array of stock objects

      // Insert stock records in bulk
      await ItemStocks.insertMany(stockEntries);

      res
        .status(201)
        .json({ success: true, message: "Stock updated successfully!" });
    } catch (error) {
      console.error("Error adding stock:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
}

export const getItemStock = async(req,res)=>{
 try {
   // Aggregate stock movements by itemId
   const stockData = await ItemStocks.aggregate([
     {
       $group: {
         _id: "$itemId",
         totalInward: {
           $sum: { $cond: [{ $eq: ["$type", "IN"] }, "$quantity", 0] },
         },
         totalOutward: {
           $sum: { $cond: [{ $eq: ["$type", "OUT"] }, "$quantity", 0] },
         },
         totalReserved: {
           $sum: { $cond: [{ $eq: ["$type", "RESERVED"] }, "$quantity", 0] },
         },
         totalUnreserved: {
           $sum: { $cond: [{ $eq: ["$type", "UNRESERVED"] }, "$quantity", 0] },
         },
       },
     },
     {
       $project: {
         itemId: "$_id",
         availableStock: {
           $subtract: [
             { $add: ["$totalInward", "$totalUnreserved"] },
             { $add: ["$totalOutward", "$totalReserved"] },
           ],
         },
       },
     },
   ]);

   res.status(200).json({ success: true, stockData });
 } catch (error) {
   console.error("Error fetching stock:", error);
   res.status(500).json({ success: false, message: "Internal Server Error" });
 }
}
