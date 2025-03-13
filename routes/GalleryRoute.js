import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createStock, deleteGalleryImages, getAvailStock, getGalleryImages, getStock, postGalleryImages,reserveStock,updateGallery,uploadGallery } from "../controllers/Gallery/Gallery.controller.js";
import { addProductCollection, createCollection, deleteCollection, getCollection, getProductCollection, removeProductCollection, updateCollection } from "../controllers/Gallery/Collection.controller.js";

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

//collection
router.post("/createCollections",createCollection)
router.get("/getCollections",getCollection);
router.put("/updateCollection/:id",updateCollection);
router.delete("/deleteCollection/:id",deleteCollection);

//product collection
router.post("/addProductToCollection",addProductCollection);
router.get("/getProductCollections",getProductCollection);
router.post("/removeProductFromCollection",removeProductCollection);


export default router;
