import express from "express";

import {
  createBooking,
  deleteBooking,
  getBooking,
  listBookings,
  updateBooking,
} from "../controllers/bookings.controller.js";
import requireAuth from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createBookingSchema,
  updateBookingSchema,
} from "../validators/booking.validator.js";

const router = express.Router();

router.use(requireAuth);

router.post(
  "/",
  validateBody(createBookingSchema),
  asyncHandler(createBooking),
);
router.get("/", asyncHandler(listBookings));
router.get("/:id", asyncHandler(getBooking));
router.put(
  "/:id",
  validateBody(updateBookingSchema),
  asyncHandler(updateBooking),
);
router.delete("/:id", asyncHandler(deleteBooking));

export default router;
