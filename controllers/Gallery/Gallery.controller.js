
import { GalleryImages } from "../../model/Gallery/Gallery.model.js";
import Stock from "../../model/Gallery/Stock.model.js";

export const postGalleryImages = async(req,res)=>{
    console.log("inside post gallery image controller",req.file)
    try {
          const image = new GalleryImages({
            image: req.file.buffer.toString("base64"),
          });
          await image.save();
          res.json({ message: "Image uploaded successfully!" });
    } catch (error) {
        console.log(error);
        res.json({error:"error in uploading image"})
    }
  
}

export const getGalleryImages = async(req,res)=>{
     try {
       const galleryItems = await GalleryImages.find().sort({ createdAt: -1 });
       res.status(200).json({ success: true, data: galleryItems });
     } catch (error) {
       console.error("Error fetching gallery:", error);
       res.status(500).json({ success: false, message: "Server error", error });
     }
}

export const deleteGalleryImages = async(req,res)=>{
try {
  const { id } = req.params; // Get image ID from request params

  const image = await GalleryImages.findById(id);
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  await GalleryImages.findByIdAndDelete(id); // Delete from DB

  res.status(200).json({ message: "Image deleted successfully" });
} catch (error) {
    console.log(error);
  res.status(500).json({ message: "Server error", error });
}
}

export const uploadGallery = async(req,res)=>{
console.log("inside upload gallery",req.body)
console.log("inside file",req.files);
  try {
    const galleryData = [];

    req.body &&
      Object.keys(req.body).forEach((key) => {
        if (key.startsWith("data_")) {
          const index = key.split("_")[1];
          const imageFile = req.files.find(
            (file) => file.fieldname === `image_${index}`
          );

          const parsedData = JSON.parse(req.body[key]);

          galleryData.push({
            image: imageFile ? `/uploads/${imageFile.filename}` : null,
            category: parsedData.category,
            color: parsedData.color,
            sizes: (parsedData.sizes),
            styleName:(parsedData.styleName),
            price: parsedData.price,
          });
        }
      });

    // Save to database
    const savedGallery = await GalleryImages.insertMany(galleryData);

    res
      .status(201)
      .json({
        success: true,
        message: "Gallery uploaded successfully",
        data: savedGallery,
      });
  } catch (error) {
    console.error("Error uploading gallery:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
}

export const updateGallery = async(req,res)=>{
  console.log(req.files,"files")
    try {
      const { category,styleName, color, sizes, quantity, price } = req.body;
      let updateData = { category, color, sizes, quantity, price, styleName };

      // If a new image is uploaded, update imageUrl
      if (req.files) {
        updateData.imageUrl = `/uploads/${req.files[0].filename}`;
        console.log(`/uploads/${req.files[0].filename}`);
      }

      const updatedGalleryItem = await GalleryImages.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedGalleryItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json({
        success: true,
        message: "Gallery item updated successfully",
        data: updatedGalleryItem,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating item", error });
      console.log(error);
    }
}


//Stock

// export const createStock = async(req,res)=>{
//     try {
//       const { stocks } = req.body;

//       for (const stock of stocks) {
//         await Stock.findOneAndUpdate(
//           { productId: stock.productId },
//           { sizes: stock.sizes },
//           { new: true, upsert: true }
//         );
//       }

//       res.json({ message: "Stock updated successfully!" });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
// }


export const createStock = async (req, res) => {
  try {
    const { stocks } = req.body; // type: "IN" or "OUT"

    

     const transactions = [];

     stocks.forEach((stock) => {
       // Convert sizes object to an array of objects
       const sizesArray = Object.entries(stock.sizes).map(
         ([size, quantity]) => ({
           size,
           quantity,
         })
       );

       // Remove sizes with 0 quantity
       const filteredSizes = sizesArray.filter((s) => s.quantity > 0);

       // Only push valid transactions with non-empty sizes
       if (filteredSizes.length > 0) {
         transactions.push({
           productId: stock.productId,
           type: "IN",
           sizes: filteredSizes,
           date: new Date(),
           reference: "Manual Stock Addition",
         });
       }
     });

    await Stock.insertMany(transactions);

    res
      .status(200)
      .json({
        message: `Stock added successfully!`,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


export const reserveStock = async(req,res)=>{
   try {
     const { products } = req.body; // type: "IN" or "OUT"

     const transactions = [];

     products.forEach((product) => {
       const sizesArray = Object.entries(product.sizes2).map(
         ([size, quantity]) => ({
           size,
           quantity,
         })
       );

       transactions.push({
         productId: product._id,
         type: "RESERVED",
         sizes: sizesArray,
         date: new Date(),
         reference: "Reserved Orders",
       });
     });

     await Stock.insertMany(transactions);

         res.json({ success: true, message: "Stock reserved successfully" });
   } catch (error) {
     console.log(error);
     res.status(500).json({ error: error.message });
   }
}

// export const reserveStock = async (req, res) => {
//   try {
//     const { products } = req.body;

//     for (let product of products) {
//       const stock = await Stock.findOne({ productId: product._id });

//       if (!stock) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Stock not found" });
//       }

//       for (let size in product.sizes2) {
//         // Ensure the size exists in stock
//         if (!stock.sizes.has(size)) {
//           return res
//             .status(400)
//             .json({
//               success: false,
//               message: `Size ${size} not found in stock`,
//             });
//         }

//         // Fetch the size object
//         let stockSize = stock.sizes.get(size);

//         // Validate stock availability
//         if (
//           product.sizes2[size].availableStock >
//           stockSize.totalStock - stockSize.reservedStock
//         ) {
//           return res
//             .status(400)
//             .json({
//               success: false,
//               message: `Not enough stock for size ${size}`,
//             });
//         }

//         // Reserve stock
//         stockSize.reservedStock += product.sizes2[size].availableStock;
//         stockSize.availableStock -= product.sizes2[size].availableStock;

//         // ✅ Update the Map properly
//         stock.sizes.set(size, stockSize);
//       }

//       await stock.save();
//     }

//     res.json({ success: true, message: "Stock reserved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };





export const getStock = async(req,res)=>{
   try {
     const stocks = await Stock.find();
     res.json(stocks);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
}