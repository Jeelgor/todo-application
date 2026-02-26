const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await authService.registerUser(email, password);

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(
      email,
      password
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const accessToken = await authService.refreshToken(refreshToken);

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.userId);
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};