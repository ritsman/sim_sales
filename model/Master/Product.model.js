import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    styleName: { type: String, required: true },
    reference: { type: String, required: true },
    season: { type: String, required: true },
    category: { type: String }, // Comes from category dropdown
    hsnCode: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: Object }, // Comes from size dropdown
    items:{type:Array},
    images: { type: Object, default: "" },
  },
  { timestamps: true }
);

 const Product = mongoose.model("Product", ProductSchema);

 export default Product;
