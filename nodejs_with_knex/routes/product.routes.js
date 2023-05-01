const router = require('express').Router();

const {
  getAllProducts,
  createProduct,
  getById,
  deleteProduct,
} = require('../controllers/product.controller');

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getById).delete(deleteProduct);

module.exports = router;
