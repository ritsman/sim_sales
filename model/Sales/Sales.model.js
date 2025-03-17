import mongoose from "mongoose";

// Define Size Schema
const SizeSchema = new mongoose.Schema({
  totalStock: { type: Number, required: true, default: 0 },
  reservedStock: { type: Number, required: true, default: 0 },
  availableStock: { type: Number, required: true, default: 0 },
});

// Define Product Schema (with correct size structure)
const ProductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  styleName: { type: String, required: true },
  reference: String,
  season: String,
  category: String,
  hsnCode: String,
  price: { type: Number, required: true },
 
  sizes2: {
    type: Object,
  },
  image: String,
  isSelected: { type: Boolean, default: false },
});

const SalesOrderSchema = new mongoose.Schema(
  {
    order_no: { type: String, required: true},
    buyer: { type: String, required: true },
    shipment_destination: String,
    whatsapp_number: String,
    shipment_type: String,
    grandTotal:Number,
    confirm_date: Date,
    entry_date: Date,
    agent: String,
    factory_location: String,
    ex_factory_date: Date,
    commission: String,
    payment_terms: String,
    delivery_terms: String,
    delivery_date: Date,
    products: [ProductSchema], // Array of products
  },
  { timestamps: true }
);

const SalesOrder = mongoose.model("SalesOrder", SalesOrderSchema);
export default SalesOrder;
