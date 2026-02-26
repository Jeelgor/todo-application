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

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
