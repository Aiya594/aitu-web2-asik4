const express = require("express");
const mongoose = require("mongoose");
const dotenv=require("dotenv")
const path = require("path");

const app=express()
const PORT=process.env.PORT
const mongoURI=process.env.MONGODB_URI

//mongoDB connection
mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  }).catch((err) => console.error(err));