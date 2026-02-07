import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    const bearer =
      header && header.startsWith("Bearer ") ? header.slice(7) : null;
    const cookieToken = req.cookies?.token;

    const token = bearer || cookieToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: payload.userId, role: payload.role, email: payload.email };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
