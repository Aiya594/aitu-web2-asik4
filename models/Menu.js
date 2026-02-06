import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: "other", trim: true }, // e.g. "breakfast", "lunch"
    imageUrl: { type: String, default: "", trim: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Menu", MenuSchema, "menuItems");
