

// import mongoose from "mongoose";
// const sizeSchema = new mongoose.Schema({
//   totalStock: { type: Number, required: true, default: 0 },
//   reservedStock: { type: Number, required: true, default: 0 },
//   availableStock: { type: Number, required: true, default: 0 },
// });

// const stockSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   sizes: { type: Map, of: sizeSchema, default: {} }, // ✅ Defines a map of size objects
// });

// const Stock = mongoose.model("Stock", stockSchema);
// export default Stock;

import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  type: {
    type: String,
    enum: ["IN", "OUT", "RESERVED","UNRESERVED"], // IN: Add Stock, OUT: Deduct Stock, RESERVED: Hold Stock
    required: true,
  },
  sizes: [
    {
      size: { type: String },
      quantity: { type: Number, min: 0 },
    },
  ],
  date: { type: Date, default: Date.now },
  // reference: { type: String }, // e.g., Purchase Order #1234, Sales Order #5678
});

const Stock = mongoose.model("Stock", stockTransactionSchema);
export default Stock;

