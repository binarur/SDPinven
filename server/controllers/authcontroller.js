import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

// Example Login function
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Fetch user data from DB
    const [user] = await pool.query("SELECT * FROM USER WHERE username = ?", [username]);

    if (user.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user[0].password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user[0].id, role: user[0].role }, process.env.JWT_SECRET || "LAKSHITHA", { expiresIn: "1h" });
    console.log("Generated Token:", token);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Example Add User function
export const addUser = async (req, res) => {
  const { username, password, firstName, lastName, email, role } = req.body;

  // Check if all fields are provided
  if (!username || !password || !firstName || !lastName || !email || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const validRoles = ["admin", "cashier"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }

  try {
    // Check if the username already exists
    const [existingUser] = await pool.query("SELECT * FROM USER WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      "INSERT INTO USER (username, password_hash, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?, ?)",
      [username, hashedPassword, firstName, lastName, email, role]
    );

    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
