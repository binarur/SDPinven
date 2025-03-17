// routes/usermanageRoutes.js

import express from "express";
import { usermanageGetUsers } from "../controllers/usermanageController.js"; 
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

// Route to fetch all users (Only accessible by admins)
router.get("/users", verifyToken , usermanageGetUsers);

export default router;
