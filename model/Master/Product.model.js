import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    styleName: { type: String, required: true },
    reference: { type: String, required: false },
    season: { type: String, required: false },
    category: { type: String }, // Comes from category dropdown
    hsnCode: { type: String, required: false },
    sku: { type: String, required: false },
    color: { type: Object, required: false },
    cost: { type: Number, required: false },

    price: { type: Number, required: true },
    size: { type: Object }, // Comes from size dropdown
    items: { type: Array },
    images: { type: Object, default: "" },
  },
  { timestamps: true }
);

 const Product = mongoose.model("Product", ProductSchema);

 export default Product;
