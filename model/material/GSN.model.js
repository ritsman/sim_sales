import mongoose from "mongoose";


const gsnSchema = new mongoose.Schema(
  {
    gsnNumber: { type: String, required: true },
    type: { type: String, default: "item" },
    category: { type: String, required: true },
    salesOrder: { type: String, required: false },
    date: { type: Date, required: true },
    deliveryDate: { type: Date },
    party: { type: Object, required: false },
    partyLocation: { type: Object, required: false },
    items: [
      {
        description: {
          type: String,
          required: false,
        },
        size: {
          type: String,
          required: false,
        },
        styleName: {
          type: String,
          required: false,
        },
        productId: {
          type: String,
          required: false,
        },
        itemId: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          required: false,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: false,
          min: 0,
        },
        tax: {
          type: Number,
          required: false,
          min: 0,
        },
        amount: {
          type: Number,
          required: false,
          min: 0,
        },
      },
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
  },
  { timestamps: true }
);

export const GSN = mongoose.model("GSN", gsnSchema);

