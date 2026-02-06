import express from "express";

import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import bookingsRoutes from "./bookings.routes.js";
import menuRoutes from "./menu.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/menu", menuRoutes);

export default router;
