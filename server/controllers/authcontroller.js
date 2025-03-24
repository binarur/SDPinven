import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Use the model to fetch user data
    const user = await UserModel.findUserByUsername(username);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role }, 
      process.env.JWT_SECRET || "LAKSHITHA", 
      { expiresIn: "1h" }
    );
    
    console.log("Generated Token:", token);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};