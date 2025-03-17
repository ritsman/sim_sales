import express from "express";
import { createShipment, getShipment, outStock } from "../controllers/Shipment/Shipment.controller.js";

const router = express.Router();


router.post("/OutStock",outStock);
// router.get("/getSales",getSales);
// router.delete("/cancelOrder/:orderId", cancelOrder);

//shipment
router.post("/createShipment",createShipment)
router.get("/getDispatched", getShipment);


export default router;

