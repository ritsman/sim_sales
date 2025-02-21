
import { GalleryImages } from "../../model/Gallery/Gallery.model.js";

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
      const { category, color, sizes, quantity, price } = req.body;
      let updateData = { category, color, sizes, quantity, price };

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