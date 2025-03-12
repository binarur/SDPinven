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

// Add Product
app.post("/api/products", async (req, res) => {
  const {
    product_name,
    brand_id,
    category_id,
    color_id,
    price,
    stock_quantity,
    emmi_number,
  } = req.body;

  // Validate required fields
  if (!product_name || !brand_id || !category_id || !color_id || !price || !stock_quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = `
      INSERT INTO PRODUCT (product_name, brand_id, category_id, color_id, price, stock_quantity, emmi_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      product_name,
      brand_id,
      category_id,
      color_id,
      price,
      stock_quantity,
      emmi_number,
    ]);

    res.status(201).json({ message: "Product added successfully!", productId: result.insertId });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));