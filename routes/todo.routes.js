const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  CreateTodos,
  GetTodos,
  GetOneTodo,
  DeleteTodo,
  updateTodo,
} = require("../controllers/todo.controller");

router.post("/todos", authMiddleware, CreateTodos);
router.get("/todos", authMiddleware, GetTodos);
router.get("/todos/:id", authMiddleware, GetOneTodo);
router.put("/todos/:id", authMiddleware, updateTodo);
router.delete("/todos/:id", authMiddleware, DeleteTodo);

module.exports = router;
