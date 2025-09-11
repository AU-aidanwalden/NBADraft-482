import express from "express";
import { login, register, whoami } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/whoami", whoami);

export default router;
