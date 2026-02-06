import Booking from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";

export async function createBooking(req, res) {
  const booking = await Booking.create({
    user: req.user.id,
    ...req.body,
  });
  res.status(201).json({ message: "Booking created", booking });
}

export async function listBookings(req, res) {
  const bookings = await Booking.find({ user: req.user.id })
    .sort({ dateTime: 1 })
    .lean();
  res.json({ bookings });
}

export async function getBooking(req, res) {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json({ booking });
}

export async function updateBooking(req, res) {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: req.body },
    { new: true },
  );
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json({ message: "Booking updated", booking });
}

export async function deleteBooking(req, res) {
  const booking = await Booking.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json({ message: "Booking deleted" });
}
