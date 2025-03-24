import express from "express";
import { 
    addProduct, 
    getCategories, 
    getBrands, 
    getColors,
    addCategory,       
    addBrand,
    addColor 
  } from "../controllers/productcontroller.js"; 
import upload from "../config/upload.js";

const router = express.Router();

// Category routes
router.get("/categories", getCategories);
router.post("/categories", addCategory);

// Brand routes
router.get("/brands", getBrands);
router.post("/brands", addBrand);

// Color routes
router.get("/colors", getColors);
router.post("/colors", addColor);

// Product routes
//router.post("/addproduct", addProduct);

router.post("/addproduct", upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'additional_images', maxCount: 4 }
]), addProduct);


export default router;