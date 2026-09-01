const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, sellerOrAdmin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, sellerOrAdmin, createProduct);
router.get('/featured', getFeaturedProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, sellerOrAdmin, updateProduct)
  .delete(protect, sellerOrAdmin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
