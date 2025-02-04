import bcrypt from "bcrypt";
import User from "../model/User.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const login = async (req, res) => {
  console.log("inside login controller", req.body);

  const jwtSecret = generateJWTSecret();

  try {
    const { user, password } = req.body;
    let role = "";
    if (user == "admin@gmail.com") {
      role = "admin";
    } else {
      role = "user";
    }
    const users = await User.findOne({ user });
    if (!users) {
      return res.status(400).send("Invalid email or password");
    } else {
      const validPassword = await bcrypt.compare(password, users.password);
      if (!validPassword) {
        return res.status(400).send("Invalid email or password");
      } else {
        const token = jwt.sign(
          {
            _id: users._id,
            role: role,
            name: users.name,
            user: users.user,
          },
          jwtSecret,
          {
            expiresIn: "1h",
          }
        );
        res.send(token);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, user, password } = req.body;

    const existingUser = await User.findOne({ user });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const users = new User({
      name,
      user,
      password: hashedPassword,
    });
    await users.save();
    res.status(201).send("User registered successfully");
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
