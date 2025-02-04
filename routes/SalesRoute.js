import express from "express";

const router = express.Router();

import { getSales, postSales } from "../controllers/Sales/Sales.controller.js";

router.post("/postSales",postSales);
router.get("/getSales",getSales);

export default router;
