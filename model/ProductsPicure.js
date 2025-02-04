import mongoose from "mongoose";

const PictureSchema = new mongoose.Schema(
  {
    styleId: {
      type: String,
      unique: true,
    },
    image1: {
      data: {
        type: Buffer,
      },
      contentType: {
        type: String,
      },
    },
    image2: {
      data: {
        type: Buffer,
      },
      contentType: {
        type: String,
      },
    },
    image3: {
      data: {
        type: Buffer,
      },
      contentType: {
        type: String,
      },
    },
    image4: {
      data: {
        type: Buffer,
      },
      contentType: {
        type: String,
      },
    },
  },
  {
    timestams: true,
  }
);

const ProductPictures = mongoose.model("Productpicture", PictureSchema);

export default ProductPictures;
