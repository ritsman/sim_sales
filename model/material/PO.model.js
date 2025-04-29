import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    party: {
      type: Object,
      required: true,
      unique: true,
    },
    partyLocation: {
      type: Object,
      required: true,
      unique: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },

    items: [
      {
        description: {
          type: String,
          required: true,
        },
        itemId: {
          type: String,
          required: true,
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

    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Submitted", "Approved", "Rejected", "Completed"],
      default: "Draft",
    },
 
  },
  {
    timestamps: true,
  }
);

export const  PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

