import express from "express";
import {authenticateSuperAdmin}  from "../Middleware/Auth.js"
import { adminLogin, approveUser, getAllUser, getPendingUsers } from "../controllers/SuperAdmin/SuperAdmin.controller.js";

const router = express.Router();

// Admin authentication endpoint
router.post('/login',adminLogin);

// Get all users (approved and pending)
router.get('/users', getAllUser);

// Get pending users for approval
router.get('/pending-users', authenticateSuperAdmin,getPendingUsers);

router.put(
  "/approve-user/:userId",
  
  approveUser
);


export default router;

