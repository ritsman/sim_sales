import express from "express";
import { createProfile, deleteProfile, getProfile, updateProfile } from "../controllers/Profile/Profile.controller.js";

const router = express.Router();

router.post("/createProfile",createProfile);
router.get("/getProfile",getProfile);
router.put("/updateProfile/:id",updateProfile);
router.delete("/deleteProfile/:id",deleteProfile)

export default router;
