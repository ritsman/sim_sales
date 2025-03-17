import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createStock, deleteGalleryImages, getAvailStock, getGalleryImages, getStock, postGalleryImages,reserveStock,updateGallery,uploadGallery } from "../controllers/Gallery/Gallery.controller.js";
import { addItemToCollection, addProductCollection, createCollection, createItemCollection, deleteCollection, deleteItemCollection, getCollection, getItemCollection, getItemFromCollection, getProductCollection, removeItemFromCollection, removeProductCollection, updateCollection, updateItemCollection } from "../controllers/Gallery/Collection.controller.js";

const router = express.Router();

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage })

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post("/postGalleryImage", upload.single("image"), postGalleryImages);
router.get("/getGalleryImage",getGalleryImages)
router.delete("/deleteGalleryImage/:id", deleteGalleryImages);

router.post("/uploadGallery", upload.any(), uploadGallery);
router.put("/updateGallery/:id", upload.any(), updateGallery);

//Stock
router.put("/createStock",createStock);
router.get("/getStock",getStock)
router.get("/getAvailStock",getAvailStock)
router.post("/reserveStock", reserveStock);

// product collection
router.post("/createProductCollections",createCollection)
router.get("/getProductCollections",getCollection);
router.put("/updateProductCollection/:id",updateCollection);
router.delete("/deleteProductCollection/:id",deleteCollection);

//product from collection
router.post("/addProductToCollection",addProductCollection);
router.get("/getProductFromCollections",getProductCollection);
router.post("/removeProductFromCollection",removeProductCollection);

//item collection 
router.post("/createItemCollections", createItemCollection);
router.get("/getItemCollections", getItemCollection);
router.put("/updateItemCollection/:id", updateItemCollection);
router.delete("/deleteItemCollection/:id", deleteItemCollection);

//item from collection
router.post("/addItemToCollection", addItemToCollection);
router.get("/getItemFromCollections", getItemFromCollection);
router.post("/removeItemFromCollection", removeItemFromCollection);




export default router;
