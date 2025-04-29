import mongoose from "mongoose";


const grnSchema = new mongoose.Schema(
  {
    grnNumber: { type: String, required: true },
    type: { type: String, default: "item" },
    category: { type: String, default: "purchase_order" },
    purchaseOrderId: { type: String, required: false },
    gsnNumber: { type: String, required: false },

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
        itemId: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        tax: {
          type: Number,
          required: true,
          min: 0,
        },
        amount: {
          type: Number,
          required: true,
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

export const GRN = mongoose.model("GRN", grnSchema);

