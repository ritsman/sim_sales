import mongoose from "mongoose";

// Define Mongoose Schema and Model
const unitSchema = new mongoose.Schema({
  unitName: String,
  shortName: String,
});

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
