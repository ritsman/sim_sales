import express from "express";

const router = express.Router();

import { cancelOrder, getOrder, getSales, postSales } from "../controllers/Sales/Sales.controller.js";

router.post("/postSales",postSales);
router.get("/getSales",getSales);
router.get("/getOrder/:orderNo", getOrder);
router.delete("/cancelOrder/:orderId", cancelOrder);


export default router;
