const express = require('express');
const router = express.Router();
const { searchCategories, getCategoryById, createCategory } = require('../controllers/categoryController');

router.get('/category/search', searchCategories);
router.get('/category/:id', getCategoryById);
router.post('/category', createCategory);

module.exports = router;