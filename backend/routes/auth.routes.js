import express from "express";
import { register, VerifyUser } from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/test", (req, res) => {
  return res.send("success");
});
router.post("/register", register);
router.post("/verify-user", VerifyUser);
export { router };
