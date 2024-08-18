const express = require('express');
const router = express.Router();
const { searchCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/category/search', searchCategories);
router.get('/category/:id', getCategoryById);
router.post('/category', createCategory);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

module.exports = router;