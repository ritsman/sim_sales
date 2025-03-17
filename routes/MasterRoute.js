import express from "express";
import multer from "multer";
import path from "path";

import { createSize, deleteSize, getSizes, updateSize } from "../controllers/Master/Size.controller.js";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controllers/Master/Product.conroller.js";
import { createGroup, deleteGroup, getGroup, updateGroup } from "../controllers/Master/Group.controller.js";
import { createParty, deleteParty, getParty, updateParty } from "../controllers/Master/Party.controller.js";
import { createUnit, deleteUnit, getUnit, updateUnit } from "../controllers/Master/Unit.controller.js";
import { addItemStocks, createItems, deleteItems, getItems, getItemStock, updateItems } from "../controllers/Master/Items.controller.js";
import { addActivity, deleteActivity, getActivity, updateActivity } from "../controllers/Master/Activity.controller.js";
import { addProcess, deleteProcess, getprocess, updateProcess } from "../controllers/Master/Process.controller.js";

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


// const storage1 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "uploads/")); // Ensure "uploads" folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload1 = multer({ storage: storage1 });

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

//Items




router.post(
  "/createItems",
  upload.fields([
    { name: "image", maxCount: 1 },
   
  ]),
  createItems
);
router.put("/updateItems/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
   
  ]), updateItems);
router.get("/getItems", getItems);
router.post("/deleteItems", deleteItems);
router.post("/addItemStock",addItemStocks);
router.get("/getItemStock",getItemStock);

//activity
router.post("/addActivity",addActivity);
router.get("/getActivity",getActivity);
router.put("/updateActivity/:id",updateActivity);
router.delete("/deleteActivity/:id",deleteActivity)

//process
router.post("/addProcess", addProcess);
router.get("/getProcess", getprocess);
router.put("/updateProcess/:id", updateProcess);
router.delete("/deleteProcess/:id", deleteProcess);



export default router;
