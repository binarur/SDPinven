import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Fetch user from DB to verify role exists
    const [users] = await pool.query("SELECT * FROM USERS WHERE id = ?", [decoded.user_id]);
    if (users.length === 0) {
      return res.status(403).json({ error: "User not found." });
    }

    req.user.role = users[0].user_role;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
