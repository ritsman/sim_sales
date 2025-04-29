import express from "express";

const router = express.Router();
import {
  postPurchaseOrder,
  
  postGRN,
  getGRN,
  postGSN,
  getGSN,
  
} from "../controllers/Material.controller.js";
import {
  createGRN,
  createGSN,
  createPurchaseOrder,
  deleteGRN,
  deleteGSN,
  deletePurchaseOrder,
  getGRNById,
  getGSNById,
  getPurchaseOrder,
  getPurchaseOrderById,
} from "../controllers/Material/Material.controller.js";

// router.post("/purchaseOrderPost", postPurchaseOrder);
// // router.get("/getPurchaseOrder/:id", getPurchaseOrder);
// router.post("/postGRN", postGRN);
// router.get("/getGRN", getGRN);
// router.post("/postGSN", postGSN);
// router.get("/getGSN", getGSN);


//Purchase order
router.post("/createPurchaseOrder",createPurchaseOrder)
router.get("/getPurchaseOrder", getPurchaseOrder);
router.get("/getPurchaseOrder/:id", getPurchaseOrderById);
router.delete("/deletePurchaseOrder/:id",deletePurchaseOrder );

//GRN
router.post("/createGRN", createGRN);
router.get("/getGRN", getGRN);
router.get("/getGRNById/:id",getGRNById );
router.delete("/deleteGRN/:id",deleteGRN );

//GSN
router.post("/createGSN", createGSN);
router.get("/getGSN", getGSN);
router.get("/getGSNById/:id", getGSNById);
router.delete("/deleteGSN/:id", deleteGSN);



export default router;
