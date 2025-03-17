import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import productRoutes from "./routes/productroute.js";
import authRoutes from "./routes/authroute.js";
import usermanageRoutes from "./routes/usermanageRoutes.js"; 
import { verifyToken } from "./middleware/authmiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test Database Connection
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.status(200).json({ message: "Database connected successfully", rows });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ message: "Database connection error" });
  }
});

// Authentication Routes - These will handle the POST request for login
app.use("/api/auth", authRoutes); // Handles POST for /login

// Product Routes - Protected by JWT Token
app.use("/api/products", verifyToken, productRoutes); // Handles POST for /products

// User Management Routes - Admin-only access
app.use("/api/usermanage",  usermanageRoutes);  // Use the new usermanage routes, admin check is done in middleware

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
