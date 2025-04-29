import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: false },
    itemType: { type: String, required: false },
    itemColor: { type: String, required: false },
    itemSelect: { type: String, required: false },
    gst: { type: String, required: false },
    hsnCode: { type: String, required: false },
    rate: { type: String, required: false },
    issueUnit: { type: String, required: false },
    bufferUnit: { type: String, required: false },
    openingStock: { type: String, required: false },
    purchaseUnit: { type: String, required: false },
    purchaseIssueRatio: { type: String, required: false },
    moq: { type: String, required: false },
    msc1: { type: String, required: false },
    msc2: { type: String, required: false },
    specification: { type: String, required: false },
    user: { type: String, required: false },
    image: { type: String, required: false },
    group: { type: String, required: true },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;




const stockTransactionSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  type: {
    type: String,
    enum: ["IN", "OUT", "RESERVED","UNRESERVED"], // IN: Add Stock, OUT: Deduct Stock, RESERVED: Hold Stock
    required: true,
  },
  quantity:Number,
  date: { type: Date, default: Date.now },
  // reference: { type: String }, // e.g., Purchase Order #1234, Sales Order #5678
});

export const ItemStocks = mongoose.model("ItemStocks", stockTransactionSchema);



const detailedStockSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  detailedStock: { type: Array, required: true }, // Array of stock details
  totalQuantity: { type: Number, required: true }, // Total quantity of all stock entries
  type: { type: String, required: true },
  unit: { type: String, required: false },

  date: { type: Date, default: Date.now }, // Automatically set current date
});

export const ItemsStock = mongoose.model("ItemsStock", detailedStockSchema);


