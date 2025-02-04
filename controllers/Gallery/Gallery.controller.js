
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
     const images = await GalleryImages.find();
     res.json(images);
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