const router = require('express').Router();

const {
  getAllTodos,
  createTodo,
  getById,
  deleteTodo,
} = require('../controllers/todo.controller');

router.route('/').get(getAllTodos).post(createTodo);
router.route('/:id').get(getById).delete(deleteTodo);

module.exports = router;
