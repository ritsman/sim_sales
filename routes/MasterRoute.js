import express from "express";
import multer from "multer";
import path from "path";

import { createSize, deleteSize, getSizes, updateSize } from "../controllers/Master/Size.controller.js";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controllers/Master/Product.conroller.js";
import { createGroup, deleteGroup, getGroup, updateGroup } from "../controllers/Master/Group.controller.js";
import { createParty, deleteParty, getParty, updateParty } from "../controllers/Master/Party.controller.js";
import { createUnit, deleteUnit, getUnit, updateUnit } from "../controllers/Master/Unit.controller.js";

const router = express.Router();

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store images in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file
  },
});

// Multer middleware for handling multiple images
const upload = multer({ storage: storage });

// Serve images as static files
const __dirname = path.resolve();
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Product route with multiple image upload
router.post("/createProduct", upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 }
]), createProduct);
router.put(
  "/updateProduct/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  updateProduct
);
router.get("/getProduct", getProduct);
router.post("/deleteProduct", deleteProduct);

//size
router.post("/createSize", createSize);
router.put("/updateSize/:id",updateSize);
router.get("/getSizes", getSizes);
router.delete("/deleteSize/:id",deleteSize)

//group
router.post("/createGroup", createGroup);
router.put("/updateGroup/:id", updateGroup);
router.get("/getGroup", getGroup);
router.delete("/deleteGroup/:id", deleteGroup);

//party
router.post("/createParty", createParty);
router.put("/updateParty/:id", updateParty);
router.get("/getParty", getParty);
router.post("/deleteParty", deleteParty);

//unit
router.post("/createUnit", createUnit);
router.put("/updateUnit/:id", updateUnit);
router.get("/getUnit", getUnit);
router.delete("/deleteUnit/:id", deleteUnit);




export default router;
