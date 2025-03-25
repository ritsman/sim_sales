import mongoose from "mongoose";

const poSchema = new mongoose.Schema({
  type: Object,
});

const PurchaseOrder = mongoose.model("PurchaseOrder", poSchema);

export default PurchaseOrder;
