import express from "express";
import { createInvoice, createShipment, getDispatched, getShipment, outStock } from "../controllers/Shipment/Shipment.controller.js";

const router = express.Router();


router.post("/OutStock",outStock);
// router.get("/getSales",getSales);
// router.delete("/cancelOrder/:orderId", cancelOrder);

//dispatch
router.post("/createShipment",createShipment)
router.get("/getDispatched", getShipment);
router.get("/getDispatchedByOrderNo/:orderNo", getDispatched);

//invoice
router.post("/createInvoice",createInvoice)




export default router;

