const router = require('express').Router();

const {
  getAllUsers,
  createUser,
  getById,
  deleteUser,
} = require('../controllers/user.controller');

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getById).delete(deleteUser);

module.exports = router;
