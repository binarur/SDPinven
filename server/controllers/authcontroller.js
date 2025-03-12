import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Handle user login and issue a JWT token
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const [users] = await pool.query("SELECT * FROM USERS WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = users[0];

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { user_id: user.id, username: user.username, role: user.user_role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set expiration for 1 hour
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.user_role } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handle adding a new user (Admin Only)
export const addUser = async (req, res) => {
  const { firstName, lastName, email, userRole, username, password } = req.body;

  try {
    // Only admin can add users
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await pool.query(
      "INSERT INTO USERS (first_name, last_name, email, user_role, username, password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, userRole, username, hashedPassword]
    );

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
