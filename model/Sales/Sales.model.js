// models/Order.js
import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  order_no: {
    type: String,
    required: true,
    unique: true,
  },
  buyer: {
    type: String,
  },
  ship_des: String,
  shipmen_type: String,
  confirm_date: String,
  entry_date: String,
  merchandiser: String,
  factory_loc: String,
  ex_fac_dat: String,
  marketing_agent: String,
  commission: String,
  payment_terms: String,
  del_terms: String,
  del_date: String,
});
const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
