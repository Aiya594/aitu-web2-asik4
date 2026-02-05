import mongoose from "mongoose";

export default async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB error:", err.message);
    throw err;
  }
}
