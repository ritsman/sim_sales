import express from "express";

const router = express.Router();
import {
  postPurchaseOrder,
  getPurchaseOrder,
  postGRN,
  getGRN,
  postGSN,
  getGSN,
} from "../controllers/Material.controller.js";

router.post("/purchaseOrderPost", postPurchaseOrder);
router.get("/getPurchaseOrder/:id", getPurchaseOrder);
router.post("/postGRN", postGRN);
router.get("/getGRN", getGRN);
router.post("/postGSN", postGSN);
router.get("/getGSN", getGSN);

export default router;
