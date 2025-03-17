// controllers/usermanageController.js

import pool from "../config/db.js";

// Controller to fetch all users
export const usermanageGetUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT user_id, first_name, last_name, role, email FROM USER");
    
    // Format and return the users' data
    const formattedUsers = users.map(user => ({
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      email: user.email
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
