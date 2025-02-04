import express from "express";
import multer from "multer";
import { deleteGalleryImages, getGalleryImages, postGalleryImages } from "../controllers/Gallery/Gallery.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/postGalleryImage", upload.single("image"), postGalleryImages);
router.get("/getGalleryImage",getGalleryImages)
router.delete("/deleteGalleryImage/:id", deleteGalleryImages);


export default router;
