import { Router } from "express";
import requireAuth from "../middleware/auth.middleware.js";
import requireAdmin from "../middleware/auth.requireAdmin.js";
import { validateBody } from "../middleware/validate.middleware.js";

import {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller.js";

import {
  createMenuSchema,
  updateMenuSchema,
} from "../validators/menu.validator.js";

const router = Router();

router.get("/", getMenu);
router.get("/:id", getMenuItem);
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createMenuSchema),
  createMenuItem,
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateBody(updateMenuSchema),
  updateMenuItem,
);
router.delete("/:id", requireAuth, requireAdmin, deleteMenuItem);

export default router;
