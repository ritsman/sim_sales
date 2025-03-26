import User from "../../model/User.models.js";
const SUPER_ADMIN_EMAIL="admin@gmail.com";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const adminLogin = async(req,res)=>{
    console.log("admin login invoked")
    let jwt_token = generateJWTSecret();
      try {
        const { email, password } = req.body;

        console.log(email,password,"admin")

        // Find the super admin user
        const admin = await User.findOne({ email });

        if (!admin || admin.email !== SUPER_ADMIN_EMAIL) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
          { userId: admin._id, email: admin.email, isAdmin: true },
          jwt_token,
          { expiresIn: "24h" }
        );
        res.json({ token, message: "Admin login successful" });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "Admin login failed", error: error.message });
      }
}

export const getAllUser = async(req,res)=>{
    console.log("invoked all users")
      try {
        const users = await User.find().select("-password");
        res.json({ users });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error fetching users", error: error.message });
      }
}


export const getPendingUsers = async(req,res)=>{
      try {
        const pendingUsers = await User.find({ approved: false }).select(
          "-password"
        );
        res.json({ pendingUsers });
      } catch (error) {
        res
          .status(500)
          .json({
            message: "Error fetching pending users",
            error: error.message,
          });
      }
}

export const approveUser = async(req,res)=>{
       try {
      const { userId } = req.params;
      const { approved, allowedPages } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { approved, allowedPages },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }
