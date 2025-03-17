import express from "express";

const router = express.Router();
import {
  login,
  register,
  forgotPass,
  resetPass,
} from "../controllers/User.controller.js";

router.post("/login", login);
router.post("/register", register);
router.post("/forgotPassword", forgotPass);
router.post("/resetPassword/:token", resetPass);
export default router;
