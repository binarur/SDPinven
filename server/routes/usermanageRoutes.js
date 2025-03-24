import express from "express";
import { usermanageGetUsers, addUser } from "../controllers/usermanageController.js"; 
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

// Route to fetch all users (Only accessible by admins)
router.get("/users", verifyToken, usermanageGetUsers);

// Add User Route (Only Admins)
router.post("/add-user", verifyToken, addUser);

export default router;