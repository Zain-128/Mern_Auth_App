import express from "express";
import {
  loginUser,
  logoutUser,
  register,
  VerifyUser,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/verify-user", VerifyUser);
router.post("/login-user", loginUser);
router.post("/logout-user", logoutUser);
export { router };
