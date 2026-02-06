import express from "express";

import { getProfile, updateProfile } from "../controllers/users.controller.js";
import requireAuth  from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProfileSchema } from "../validators/user.validator.js";

const router = express.Router();

router.get("/profile", requireAuth, asyncHandler(getProfile));
router.put(
  "/profile",
  requireAuth,
  validateBody(updateProfileSchema),
  asyncHandler(updateProfile),
);

export default router;
