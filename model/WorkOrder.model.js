
import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  activityName: String,
  description: String,
  time: Number,
  cost: Number,
  group: String,
});

const InputSchema = new mongoose.Schema({
  itemName: String,
  itemType: String,
  itemColor: String,
  itemSelect: String,
  gst: String,
  hsnCode: String,
  rate: String,
  issueUnit: String,
  bufferUnit: String,
  openingStock: String,
  purchaseUnit: String,
  purchaseIssueRatio: String,
  moq: String,
  msc1: String,
  msc2: String,
  specification: String,
  user: String,
  image: String,
  group: String,
});

const OutputSchema = new mongoose.Schema({
  styleName: String,
  reference: String,
  season: String,
  category: String,
  hsnCode: String,
  sku: String,
  color: {
    colorName: String,
    hex: String,
  },
  cost: Number,
  price: Number,
  size: {
    sizeName: String,
    sizes: [String],
  },
  items: Array,
  images: {
    image1: String,
    image2: String,
    image3: String,
  },
});

const WorkOrderSchema = new mongoose.Schema(
  {
    workOrderNo: { type: String, required: true },
    startTime: Date,
    endTime: Date,
    processId: mongoose.Schema.Types.ObjectId,
    activityIds: [ActivitySchema],
    // inputs: [InputSchema],
    // outputs: [OutputSchema],
    inputs: { type: Array, required: false },
    outputs: { type: Array, required: true },
  },
  { timestamps: true }
);

const WorkOrder = mongoose.model("WorkOrder", WorkOrderSchema);

export default WorkOrder;