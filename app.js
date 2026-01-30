const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const routes = require("./routes/routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  }),
);

app.use("/api/auth", routes);

(async () => {
  try {
    await connectDB(mongoURI);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start");
    process.exit(1);
  }
})();
