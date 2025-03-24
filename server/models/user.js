// models/user.js
import pool from "../config/db.js";

//find user by username

export const findUserByUsername = async (username) => {
  // Query to find a user by username
  const [rows] = await pool.query("SELECT * FROM USER WHERE username = ?", [username]);
  return rows[0];
};

//create user

export const createUser = async (userData) => {
  const { username, password_hash, first_name, last_name, email, role } = userData;
  
  // Query to insert a new user
  const [result] = await pool.query(
    "INSERT INTO USER (username, password_hash, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?, ?)",
    [username, password_hash, first_name, last_name, email, role]
  );
  return result.insertId;
};

//get all users

export const getAllUsers = async () => {
  // Query to get all users with limited fields
  const [users] = await pool.query("SELECT user_id, first_name, last_name, role, email FROM USER");
  return users;
};

//check if username exists

export const checkIfUsernameExists = async (username) => {
  // Query to check if username exists
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM USER WHERE username = ?", [username]);
  return rows[0].count > 0;
};

export const updateUser = async (userId, userData) => {
  const fields = Object.keys(userData);
  const values = Object.values(userData);
  
  if (fields.length === 0) return false;
  
  // Query to update user information
  const query = `UPDATE USER SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE user_id = ?`;
  const [result] = await pool.query(query, [...values, userId]);
  
  return result.affectedRows > 0;
};
