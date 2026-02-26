const Todo = require("../models/todo.model");

exports.CreateTodos = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const todo = await Todo.create({
      title,
      description,
      status,
      userId: req.user.userId,
    });

    return res.status(201).json({ msg: "Todo is created", data: todo });
  } catch (error) {
    next(error);
  }
};

exports.GetTodos = async (req, res, next) => {
  try {
    const getTodos = await Todo.find().lean();
    return res.status(200).json({ msg: "Todos fecthed", data: getTodos });
  } catch (error) {
    next(error);
  }
};

exports.GetOneTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getOneTodo = await Todo.findById(id).lean();

    return res
      .status(200)
      .json({ msg: `Todo Fetched for id ${id}`, data: getOneTodo });
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, description, status },
      { new: true },
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json({
      message: "Todo updated",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

exports.DeleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete({
      _id: id,
      userId: req.user.userId,
    });
    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    res.json({
      message: "Todo removed",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};
