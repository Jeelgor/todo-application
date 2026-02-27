/**
 * @swagger
 * tags:
 *   name: admin
 *   description: Admin Panel
 */

/**
 * @swagger
 * /admin/todos:
 *   get:
 *     summary: Admin User
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { getAllUserTodos } = require("../controllers/todo.controller");

router.get(
  "/admin/todos",
  authMiddleware,
  authorizeRoles("admin"),
  getAllUserTodos,
);

module.exports = router;
