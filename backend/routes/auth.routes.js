import express from "express";
import {
  loginUser,
  register,
  VerifyUser,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/test", (req, res) => {
  return res.send("success");
});
router.post("/register", register);
router.post("/verify-user", VerifyUser);
router.post("/login-user", loginUser);
export { router };
