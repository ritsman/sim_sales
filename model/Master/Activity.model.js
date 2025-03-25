import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  activityName: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Number, required: true },
  cost: { type: Number, required: true },
});

export const Activity = mongoose.model("Activity", activitySchema);
