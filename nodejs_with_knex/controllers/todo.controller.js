const todoDao = require('../data/dao/todos');

exports.getAllTodos = async (req, res) => {
  const todos = await todoDao.all();
  return res.status(200).json(todos);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const todo = await todoDao.get(id);

  return todo
    ? res.status(200).json(todo)
    : res.status(404).send(`todo with id ${id} not found`);
};

exports.createTodo = async (req, res) => {
  const { title, order } = req.body;
  const newTodo = await todoDao.create({ title, order });
  return res.status(201).json(newTodo);
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const removedTodo = await todoDao.remove(id);
  return removedTodo
    ? res.status(200).send('Todo successfully deleted')
    : res.status(404).send(`todo with id ${id} not found`);
};
