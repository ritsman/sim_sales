import express from "express";

const router = express.Router();

import { cancelOrder, getSales, postSales } from "../controllers/Sales/Sales.controller.js";

router.post("/postSales",postSales);
router.get("/getSales",getSales);
router.delete("/cancelOrder/:orderId", cancelOrder);


export default router;
