import express from "express";

import { register, login, logout } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));
router.post("/logout", asyncHandler(logout));

export default router;
