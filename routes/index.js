import express from "express";
import multer from "multer";
import path from "path";
import { MulterMid } from "../Middleware/MulterMid.js";



const router = express.Router();

import WorkOrderRoute from "./WorkOrderRoute.js";
import MaterialRoute from "./MaterialRoute.js";
import AuthRoute from "./AuthRoute.js";
import SalesRoute from "./SalesRoute.js";
import GalleryRoute from "./GalleryRoute.js"
import MasterRoute from "./MasterRoute.js"


router.use("/api/workOrder", WorkOrderRoute);
router.use("/api/gallery",GalleryRoute)
router.use("/api/material", MaterialRoute);
router.use("/api/auth", AuthRoute);
router.use("/api/sales",SalesRoute);
router.use("/api/master",MasterRoute);

import {
  productPictures,
  getPicturesController,
} from "../controllers/Pictures.controller.js";

router.get("/api/getPictures", getPicturesController);
router.post("/api/PostPictures", MulterMid,productPictures);

export default router;

// let storage = multer.diskStorage({
//   destination: "Assets/images",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// let upload = multer({
//   storage: storage,
// });
