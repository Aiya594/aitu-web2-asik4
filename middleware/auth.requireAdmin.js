export default function requireAdmin(req, res, next) {
  const role =
    req.user?.role ||
    req.user?.user?.role ||
    req.authUser?.role ||
    req.auth?.role;

  if (!role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }

  next();
}
