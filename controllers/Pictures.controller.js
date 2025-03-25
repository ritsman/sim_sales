import ProductPictures from "../model/ProductsPicure.js";
import fs from "fs";

export const productPictures = async (req, res) => {
  console.log("Reached in pictures controllers");

  const Picture = await ProductPictures.findOne({ styleId: req.body.styleId });

  if (!Picture) {
    try {
      const { image1, image2, image3, image4 } = req.files;

      const newImage1 = new ProductPictures({ styleId: req.body.styleId });

      if (image1) {
        newImage1.image1 = {
          data: fs.readFileSync(image1[0].path),
          contentType: image1[0].mimetype,
        };
      }
      if (image2) {
        newImage1.image2 = {
          data: fs.readFileSync(image2[0].path),
          contentType: image2[0].mimetype,
        };
      }
      if (image3) {
        newImage1.image3 = {
          data: fs.readFileSync(image3[0].path),
          contentType: image3[0].mimetype,
        };
      }
      if (image4) {
        newImage1.image4 = {
          data: fs.readFileSync(image4[0].path),
          contentType: image4[0].mimetype,
        };
      }

      await newImage1.save();

      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    const { image1, image2, image3, image4 } = req.files;

    if (image1) {
      Picture.image1 = {
        data: fs.readFileSync(image1[0].path),
        contentType: image1[0].mimetype,
      };
    }
    if (image2) {
      Picture.image2 = {
        data: fs.readFileSync(image2[0].path),
        contentType: image2[0].mimetype,
      };
    }
    if (image3) {
      Picture.image3 = {
        data: fs.readFileSync(image3[0].path),
        contentType: image3[0].mimetype,
      };
    }
    if (image4) {
      Picture.image4 = {
        data: fs.readFileSync(image4[0].path),
        contentType: image4[0].mimetype,
      };
    }

    await Picture.save();

    res.status(200).json({ message: "Images updated successfully" });
  }
};

export const getPicturesController = async (req, res) => {
  try {
    const pictures = await ProductPictures.find({});

    res.send(pictures);
  } catch (error) {
    console.log(error);
  }
};
