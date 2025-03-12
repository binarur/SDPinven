import express from "express";
import { login, addUser } from "../controllers/authcontroller.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

// Login Route
router.post("/login", login);

// Add User Route (Only Admins)
router.post("/add-user", verifyToken, addUser);

export default router;
