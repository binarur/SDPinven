import pool from "../config/db.js";
import upload from "../config/upload.js";

// Fetch all categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query("SELECT * FROM CATEGORY");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Add new category
export const addCategory = async (req, res) => {
  const { categoryName } = req.body;
  
  if (!categoryName) {
    return res.status(400).json({ error: "Category name is required" });
  }
  
  try {
    // Check if category already exists
    const [existingCategory] = await pool.query("SELECT * FROM CATEGORY WHERE category_name = ?", [categoryName]);
    
    if (existingCategory.length > 0) {
      return res.status(409).json({ error: "Category already exists" });
    }
    
    // Add new category
    const [result] = await pool.query("INSERT INTO CATEGORY (category_name) VALUES (?)", [categoryName]);
    
    res.status(201).json({ 
      message: `New category "${categoryName}" added successfully!`, 
      categoryId: result.insertId 
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// Fetch all brands
export const getBrands = async (req, res) => {
  try {
    const [brands] = await pool.query("SELECT * FROM BRAND");
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

// Add new brand
export const addBrand = async (req, res) => {
  const { brandName } = req.body;
  
  if (!brandName) {
    return res.status(400).json({ error: "Brand name is required" });
  }
  
  try {
    // Check if brand already exists
    const [existingBrand] = await pool.query("SELECT * FROM BRAND WHERE brand_name = ?", [brandName]);
    
    if (existingBrand.length > 0) {
      return res.status(409).json({ error: "Brand already exists" });
    }
    
    // Add new brand
    const [result] = await pool.query("INSERT INTO BRAND (brand_name) VALUES (?)", [brandName]);
    
    res.status(201).json({ 
      message: `New brand "${brandName}" added successfully!`, 
      brandId: result.insertId 
    });
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).json({ error: "Failed to add brand" });
  }
};

// Fetch all colors
export const getColors = async (req, res) => {
  try {
    const [colors] = await pool.query("SELECT * FROM COLOUR");
    res.status(200).json(colors);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
};

// Add new color
export const addColor = async (req, res) => {
  const { colorName } = req.body;
  
  if (!colorName) {
    return res.status(400).json({ error: "Color name is required" });
  }
  
  try {
    // Check if color already exists
    const [existingColor] = await pool.query("SELECT * FROM COLOUR WHERE color_name = ?", [colorName]);
    
    if (existingColor.length > 0) {
      return res.status(409).json({ error: "Color already exists" });
    }
    
    // Add new color
    const [result] = await pool.query("INSERT INTO COLOUR (color_name) VALUES (?)", [colorName]);
    
    res.status(201).json({ 
      message: `New color "${colorName}" added successfully!`, 
      colorId: result.insertId 
    });
  } catch (error) {
    console.error("Error adding color:", error);
    res.status(500).json({ error: "Failed to add color" });
  }
};

// Add Product
export const addProduct = async (req, res) => {
  upload.fields([
    { name: 'main_image', maxCount: 1 }, 
    { name: 'additional_images', maxCount: 4 }
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { category, brand, model, color, title, quantity, costPerItem, description, emiNumber } = req.body;
    const mainImage = req.files['main_image'] ? req.files['main_image'][0].path : null;
    const additionalImages = req.files['additional_images'] ? req.files['additional_images'].map(file => file.path) : [];

    if (!category || !brand || !title || !quantity || !costPerItem) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      let [categoryResult] = await pool.query("SELECT * FROM CATEGORY WHERE category_name = ?", [category]);
      let categoryId = categoryResult.length === 0 
        ? (await pool.query("INSERT INTO CATEGORY (category_name) VALUES (?)", [category]))[0].insertId 
        : categoryResult[0].category_id;

      let [brandResult] = await pool.query("SELECT * FROM BRAND WHERE brand_name = ?", [brand]);
      let brandId = brandResult.length === 0 
        ? (await pool.query("INSERT INTO BRAND (brand_name) VALUES (?)", [brand]))[0].insertId 
        : brandResult[0].brand_id;

      let [colorResult] = await pool.query("SELECT * FROM COLOUR WHERE color_name = ?", [color]);
      let colorId = colorResult.length === 0 
        ? (await pool.query("INSERT INTO COLOUR (color_name) VALUES (?)", [color]))[0].insertId 
        : colorResult[0].color_id;

      const query = `
        INSERT INTO PRODUCT (product_name, brand_id, category_id, color_id, price, stock_quantity, emmi_number, description, main_image, additional_images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.query(query, [
        title,
        brandId,
        categoryId,
        colorId,
        costPerItem,
        quantity,
        emiNumber,
        description,
        mainImage,
        JSON.stringify(additionalImages) // Store as JSON in DB
      ]);

      res.status(201).json({ 
        message: "Product added successfully!", 
        productDetails: {
          productId: result.insertId,
          category,
          brand,
          color,
          mainImage,
          additionalImages
        } 
      });

    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Failed to add product" });
    }
  });
};