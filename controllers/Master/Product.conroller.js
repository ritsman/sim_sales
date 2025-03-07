import Product from "../../model/Master/Product.model.js";
export const createProduct = async (req, res) => {
  try {
    let { styleName, reference, season, category, hsnCode, price, size } =
      req.body;

    // Extract image paths from uploaded files
    const images = {
      image1: req.files?.image1
        ? `/uploads/${req.files.image1[0].filename}`
        : "",
      image2: req.files?.image2
        ? `/uploads/${req.files.image2[0].filename}`
        : "",
      image3: req.files?.image3
        ? `/uploads/${req.files.image3[0].filename}`
        : "",
    };

    // Validate required fields
    if (!styleName || !reference || !season || !hsnCode || !price || !size) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Parse size JSON string if necessary
    if (typeof size === "string") {
      try {
        size = JSON.parse(size);
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Invalid size JSON format", receivedData: size });
      }
    }

    // Save product to database
    const newProduct = new Product({
      styleName,
      reference,
      season,
      category,
      hsnCode,
      price,
      size,
      images, // Save multiple images
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", data: newProduct });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to add product", details: error.message });
  }
};


export const getProduct = async(req,res)=>{
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: error.message });
  }
}

export const deleteProduct = async(req,res)=>{
  try {
    const { productIds } = req.body;

    if (!productIds || productIds.length === 0) {
      return res.status(400).json({ error: "No product IDs provided" });
    }

    // Delete products with matching IDs
    await Product.deleteMany({ _id: { $in: productIds } });

    res.status(200).json({ message: "Products deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete products", details: error.message });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { styleName, reference, season, category, hsnCode, price, size } =
      req.body;

    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ✅ Parse size if it exists (because it's a JSON string in FormData)
    console.log(size, "size");
    console.log("Raw size received:", req.body.size);
    console.log("Type of size:", typeof req.body.size);

   if (size && typeof size === "string") {
     try {
       console.log("Attempting to parse size:", size); // Debugging line
       size = JSON.parse(size); // Convert string to object
     } catch (error) {
       console.error("Error parsing size:", error.message);
       return res
         .status(400)
         .json({ error: "Invalid size JSON format", receivedData: size });
     }
   }


    // Prepare updated fields (only update provided fields)
    const updatedFields = {};
    if (styleName) updatedFields.styleName = styleName;
    if (reference) updatedFields.reference = reference;
    if (season) updatedFields.season = season;
    if (category) updatedFields.category = category;
    if (hsnCode) updatedFields.hsnCode = hsnCode;
    if (price) updatedFields.price = price;
    if (size) updatedFields.size = size;

    // If a new image is uploaded, update the image field
    if (req.files) {
        updatedFields.images = {
          image1: req.files?.image1
            ? `/uploads/${req.files.image1[0].filename}`
            : existingProduct.images.image1,
          image2: req.files?.image2
            ? `/uploads/${req.files.image2[0].filename}`
            : existingProduct.images.image2,
          image3: req.files?.image3
            ? `/uploads/${req.files.image3[0].filename}`
            : existingProduct.images.image3,
        };   
       }



    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ error: "Failed to update product", details: error.message });
  }
};
