import mongoose from "mongoose";

const gsnSchema = new mongoose.Schema({
  type: Object,
});

const GSN = mongoose.model("GSN", gsnSchema);

export default GSN;
