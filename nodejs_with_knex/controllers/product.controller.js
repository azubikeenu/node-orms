const productDao = require('../data/dao/product');

exports.getAllProducts = async (req, res) => {
  const products = await productDao.all();
  return res.status(200).json(products);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const product = await productDao.get(id);

  return product
    ? res.status(200).json(product)
    : res.status(404).send(`product with id ${id} not found`);
};

exports.createProduct = async (req, res) => {
  const newproduct = await productDao.create({ ...req.body });
  return res.status(201).json(newproduct);
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const removedproduct = await productDao.remove(id);
  return removedproduct
    ? res.status(200).send('product successfully deleted')
    : res.status(404).send(`product with id ${id} not found`);
};
