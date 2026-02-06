import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "User already exists");

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });

  res.status(201).json({
    message: "Registered",
    user: { id: user._id, name: user.name, email: user.email },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ApiError(401, "Invalid email or password");

  const token = signToken(user._id.toString());

  // keep cookie-based auth for the existing frontend
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    message: "Logged in",
    token, // useful for Postman / mobile clients
    user: { id: user._id, name: user.name, email: user.email },
  });
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}
