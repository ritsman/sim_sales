// models/Counter.js

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export const Counter = mongoose.model("Counter", CounterSchema);
