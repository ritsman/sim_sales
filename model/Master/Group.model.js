import mongoose from "mongoose";

// Define Mongoose Schema and Model
const GroupSchema = new mongoose.Schema({
  groupName: String,
  under: String,
  code: String,
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
