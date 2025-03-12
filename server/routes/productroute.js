import express from "express";
import { addProduct } from "../controllers/productcontroller.js";

const router = express.Router();

// Add Product Route (Protected)
router.post("/", addProduct);

export default router;

