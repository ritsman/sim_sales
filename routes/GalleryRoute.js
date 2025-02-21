import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { deleteGalleryImages, getGalleryImages, postGalleryImages,updateGallery,uploadGallery } from "../controllers/Gallery/Gallery.controller.js";

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


export default router;
