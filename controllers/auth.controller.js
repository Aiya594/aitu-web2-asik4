import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

function signToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
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

  const token = signToken(user);

  // keep cookie-based auth for the existing frontend
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    message: "Logged in",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function getProfile(req, res) {
  const user = await User.findById(req.user.id).select(
    "name email role createdAt",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}
