const express = require('express');
const router = express.Router();
const { searchCategories, getCategoryById } = require('../controllers/categoryController');

router.get('/category/search', searchCategories);
router.get('/category/:id', getCategoryById);


module.exports = router;