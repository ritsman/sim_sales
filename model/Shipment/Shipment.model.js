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
