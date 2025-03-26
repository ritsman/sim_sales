import bcrypt from "bcrypt";
import User from "../model/User.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
const SUPER_ADMIN_EMAIL="admin@gmail.com";


const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const login = async (req, res) => {
  console.log("login invoked")
  let JWT_SECRET = generateJWTSecret();
 try {
   const { email, password } = req.body;

   // Find the user
   const user = await User.findOne({ email });
   if (!user) {
     return res.status(401).json({ message: "Invalid credentials" });
   }

   // Check if user is approved
   if (!user.approved && user.email != SUPER_ADMIN_EMAIL) {
     return res.status(403).json({ message: "Account pending approval" });
   }

   // Verify password
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
     return res.status(401).json({ message: "Invalid credentials" });
   }

   // Update last login
   user.lastLogin = new Date();
   await user.save();

   // Create JWT token with user info and allowed pages
   const token = jwt.sign(
     {
       userId: user._id,
       email: user.email,
       allowedPages: user.allowedPages,
     },
     JWT_SECRET,
     { expiresIn: "24h" }
   );

   res.json({ token, allowedPages: user.allowedPages });
 } catch (error) {
  console.log(error);
   res.status(500).json({ message: "Login failed", error: error.message });
 }
};

export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password,name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already existss");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const users = new User({
      name,
      email,
      password: hashedPassword,
      approved: false,
      allowedPages: [],
    });
    await users.save();
    res
      .status(201)
      .send({ message: "Signup request sent. Awaiting admin approval." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "yadavkaran471@gmail.com",
    pass: "szwn jnwm kiqj vupk",
  },
});

export const forgotPass = async (req, res) => {
  const { email } = req.body;

  console.log("insdie forgot password", req.body);
  try {
    const user = await User.findOne({ user: email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    console.log(user);
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      to: user.user,
      from: "yadavkaran471@gmail.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const resetPass = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// function authenticateToken(req, res, next) {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).send("Access Denied");
//   try {
//     const decoded = jwt.verify(token, "jwtPrivateKey");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).send("Invalid Token");
//   }
// }

// // Example protected route
// app.get("/api/user", authenticateToken, (req, res) => {
//   if (req.user.role !== "user") return res.status(403).send("Forbidden");
//   res.send("User content");
// });

// // Example protected admin route
// app.get("/api/admin", authenticateToken, (req, res) => {
//   if (req.user.role !== "admin") return res.status(403).send("Forbidden");
//   res.send("Admin content");
// });
