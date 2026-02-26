const Todo = require("../models/todo.model");
const validator = require("validator");

exports.createTodo = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    title = title ? validator.escape(title.trim()) : "";
    description = description ? validator.escape(description.trim()) : "";
    status = status ? status.trim().toLowerCase() : "";

    if (!title) {
      return res.json({ msg: "Title is required" });
    }
    if (!description) {
      return res.json({ msg: "Description is Required" });
    }
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const todo = await Todo.create({
      title,
      description,
      status,
      userId: req.user.userId,
    });

    return res.status(201).json({
      message: "Todo created",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({
      userId: req.user.userId,
    }).lean();

    return res.status(200).json({
      message: "Todos fetched",
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOneTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({
      _id: id,
      userId: req.user.userId,
    }).lean();

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      message: "Todo fetched",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    title = title?.trim();
    description = description?.trim();
    status = status?.toLowerCase();

    if (!title) {
      return res.json({ msg: "Title is required" });
    }
    if (!description) {
      return res.json({ msg: "Description is Required" });
    }
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, description, status },
      { new: true },
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      message: "Todo updated",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      message: "Todo removed",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};
