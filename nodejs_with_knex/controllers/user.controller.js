const userDao = require('../data/dao/user');

exports.getAllUsers = async (req, res) => {
  const users = await userDao.all();
  return res.status(200).json(users);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const user = await userDao.get(id);

  return user
    ? res.status(200).json(user)
    : res.status(404).send(`user with id ${id} not found`);
};

exports.createUser = async (req, res) => {
  const user = await userDao.getByEmail(req.body?.email);
  if (user)
    return res
      .status(400)
      .json({ status: 'Error', message: `user with email already exists` });

  const newUser = await userDao.create({ ...req.body });
  return res.status(201).json(newUser);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const removedUser = await userDao.remove(id);
  return removedUser
    ? res.status(200).send('user successfully deleted')
    : res.status(404).send(`user with id ${id} not found`);
};
