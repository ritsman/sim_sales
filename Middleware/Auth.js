import User from "../model/User.models.js";
import jwt from "jsonwebtoken"
import crypto from "crypto";



export const checkPageAccess = (pageName) => {
  return (req, res, next) => {
    // User info is stored in req.user after the authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if user has access to this page
    if (!req.user.allowedPages.includes(pageName)) {
      return res.status(403).json({ message: "Access denied to this page" });
    }

    next();
  };
};

const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const authenticateSuperAdmin = async (req, res, next) => {
    console.log("invoked middleware")
    let secretKey = generateJWTSecret();
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);

    // Find user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if user is super admin
    // You can determine if a user is super admin by checking an email or specific field
    if (user.email !== process.env.SUPER_ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ message: "Access denied. Not a super admin." });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

