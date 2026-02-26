const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

exports.registerUser = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, user};
};

exports.refreshToken = async (token) => {
  const jwt = require("jsonwebtoken");

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== token)
    throw new Error("Invalid refresh token");

  const accessToken = generateAccessToken(user._id);
  return accessToken;
};

exports.logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
