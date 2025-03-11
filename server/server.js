import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";

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

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
