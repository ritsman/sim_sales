import mongoose from "mongoose";

const styleSchema = new mongoose.Schema({
  data: {
    type: Object,
  },
});

const workOrder = mongoose.model("workOrderStyle", styleSchema);

export default workOrder;
