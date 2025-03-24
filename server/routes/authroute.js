import express from "express";
import { login } from "../controllers/authcontroller.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

// Login Route
router.post("/login", login);

export default router;