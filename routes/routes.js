const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", requireAuth, getProfile);

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    //check in db if email is unique
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
    });

    console.log("User registered:", user.email);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Register error:", err);

    //mongoose duplicate key safety
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    console.log("User profile recieved");
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function logout(req, res) {
  //destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Failed to logout" });
    }

    //clear cookie
    res.clearCookie("connect.sid");
    console.log("Logout sucessfully");
    return res.status(200).json({ message: "Logged out" });
  });
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //store userId in session
    req.session.userId = user._id.toString();
    console.log(`User ${email} logged in`, email);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = router;
