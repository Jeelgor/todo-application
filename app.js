require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());

const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const authMiddleware = require("./middleware/auth.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/", todoRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

module.exports = app;
