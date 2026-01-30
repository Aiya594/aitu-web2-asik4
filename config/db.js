const mongoose = require("mongoose");

async function connectDB(mongoURI) {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

module.exports = connectDB;
