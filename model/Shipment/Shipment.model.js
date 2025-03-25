import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema({
  order_no: { type: String, required: true },
  shipment_date: { type: Date, required: true, default: Date.now },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      size: { type: String, required: true },
      dispatched_quantity: { type: Number, required: true },
    },
  ],
  dispatch_type: { type: String, enum: ["OUT"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const  Shipment = mongoose.model("Shipment", ShipmentSchema);

export default Shipment;


// models/Invoice.js

const Schema = mongoose.Schema;

const InvoiceItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  styleName: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  gstRate: {
    type: Number,
    required: true,
    default: 18,
    min: 0,
    max: 100
  },
  gstAmount: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const InvoiceSchema = new Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  orderNo: {
    type: String,
    required: true
  },
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  partyName: {
    type: String,
    required: true
  },
  partyGstin: {
    type: String
  },
  partyAddress: {
    type: String
  },
  deliveryDestination: {
    type: String,
    required: true
  },
  items: [InvoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  gstAmount: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['CREATED', 'PAID', 'PARTIAL_PAID', 'CANCELLED', 'OVERDUE'],
    default: 'CREATED'
  },
  paymentDetails: [{
    amount: Number,
    paymentDate: Date,
    paymentMode: String,
    referenceNumber: String,
    notes: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String
  },
  notes: {
    type: String
  }
}, { timestamps: true });

export const Invoice = mongoose.model('Invoice', InvoiceSchema);
