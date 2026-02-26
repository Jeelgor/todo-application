const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTodo,
  getTodos,
  getOneTodo,
  deleteTodo,
  updateTodo,
} = require("../controllers/todo.controller");

router.post("/todos", authMiddleware, createTodo);
router.get("/todos", authMiddleware, getTodos);
router.get("/todos/:id", authMiddleware, getOneTodo);
router.put("/todos/:id", authMiddleware, updateTodo);
router.delete("/todos/:id", authMiddleware, deleteTodo);

module.exports = router;
