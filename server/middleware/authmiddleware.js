import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

  console.log("Received Token:", req.header("Authorization"));
  
  const token = req.header("Authorization")?.replace("Bearer ", "");
  

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "LAKSHITHA");
    req.user = decoded; // Attach user info to the request object

    // Check if the user is an admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
