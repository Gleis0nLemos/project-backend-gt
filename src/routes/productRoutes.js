const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController')

router.get('/product/search', getProducts);
router.get('/product/:id', getProductById);
router.post('/product', createProduct);

module.exports = router;