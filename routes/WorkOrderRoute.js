import express from "express";

const router = express.Router();

import {
  Style,
  getAllNo,
  getStyle,
} from "../controllers/WorkOrder.controller.js";

router.post("/PostForm", Style);
router.get("/getFrom/:id", getStyle);
router.get("/getWorkOrderNo", getAllNo);

export default router;
