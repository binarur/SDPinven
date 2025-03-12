import pool from "../config/db.js";

// Add Product
export const addProduct = async (req, res) => {
  const { product_name, brand_id, category_id, color_id, price, stock_quantity, emmi_number } = req.body;

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
};
