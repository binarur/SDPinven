import pool from "../config/db.js";

export const findUserByUsername = async (username) => {
  const [rows] = await pool.query("SELECT * FROM USERS WHERE username = ?", [username]);
  return rows[0];
};
