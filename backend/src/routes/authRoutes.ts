import express from "express";
import { login, register, whoami } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/whoami", authMiddleware, whoami);

export default router;
