import bcryptjs from "bcryptjs";
import User from "../models/User.js";

export default async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const nameAdmin = process.env.ADMIN_NAME;

  if (!email || !password) {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set. Admin will not be created.",
    );
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return;
  }

  const hash = await bcryptjs.hash(password, 10);

  await User.create({
    name: nameAdmin,
    email: email.toLowerCase(),
    password: hash,
    role: "admin",
  });

  console.log(`Admin created: ${email}`);
}
