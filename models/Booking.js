import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    people: { type: Number, required: true, min: 1, max: 20 },
    dateTime: { type: Date, required: true },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

bookingSchema.index({ user: 1, dateTime: 1 });

export default mongoose.model("Booking", bookingSchema, "bookings");
