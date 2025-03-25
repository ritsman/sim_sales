import mongoose from "mongoose";

const grnSchema = new mongoose.Schema({
  type: Object,
});

const GRN = mongoose.model("GRN", grnSchema);

export default GRN;
