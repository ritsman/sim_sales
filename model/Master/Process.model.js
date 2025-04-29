import mongoose from "mongoose";

const processSchema = new mongoose.Schema({
  processName: { type: String, required: true },
  activities: { type: Array, required: true },
  group: { type: String, required: false },
});

export const Process = mongoose.model("Process", processSchema);
