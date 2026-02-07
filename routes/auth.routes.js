import express from "express";

import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import requireAuth from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));
router.get("/profile", requireAuth, asyncHandler(getProfile));
router.post("/logout", asyncHandler(logout));

export default router;
