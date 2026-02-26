require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());

const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const authMiddleware = require("./middleware/auth.middleware");

app.use("/api/auth", authRoutes);
app.use("/", todoRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
