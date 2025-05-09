import express from "express";

const router = express.Router();

import {
  Style,
  getAllNo,
  getStyle,
} from "../controllers/WorkOrder.controller.js";
import { createWorkOrder, deleteWorkOrder, getLastOrderNo, getWorkOrder, updateWorkOrder } from "../controllers/WorkOrder/WorkOrder.controller.js";

router.post("/PostForm", Style);
router.get("/getFrom/:id", getStyle);
router.get("/getWorkOrderNo", getAllNo);

//workOrder
router.post("/createWorkOrder",createWorkOrder);
router.get("/getWorkOrder",getWorkOrder);
router.delete("/deleteWorkOrder",deleteWorkOrder);
router.put("/updateWorkOrder",updateWorkOrder);
router.get("/lastOrderNo",getLastOrderNo);

export default router;
