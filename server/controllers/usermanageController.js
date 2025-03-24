import bcrypt from 'bcrypt';
import * as UserModel from "../models/user.js";

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
    // Check if the username already exists using the model
    const usernameExists = await UserModel.checkIfUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using the model
    await UserModel.createUser({
      username,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      email,
      role
    });

    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const usermanageGetUsers = async (req, res) => {
  try {
    // Use the model to fetch all users
    const users = await UserModel.getAllUsers();
    
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