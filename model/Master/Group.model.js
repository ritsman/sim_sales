import mongoose from "mongoose";

// Define Mongoose Schema and Model
const GroupSchema = new mongoose.Schema({
  groupName: String,
  under: String,
  selectedItems:Array
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
