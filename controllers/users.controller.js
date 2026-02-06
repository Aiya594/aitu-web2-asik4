import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function getProfile(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  res.json({ user });
}

export async function updateProfile(req, res) {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "Email already in use");
    user.email = email;
  }

  if (name) user.name = name;
  if (password) user.password = await bcrypt.hash(password, 10);

  await user.save();
  const safeUser = await User.findById(user._id).select("-password");
  res.json({ message: "Profile updated", user: safeUser });
}
