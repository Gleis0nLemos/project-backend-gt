const express = require('express');
const router = express.Router();
const { authenticateUser, getUserById, createUser, updateUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// route to authenticate user and generate token
router.post('/auth/login', authenticateUser);

// other routes
router.get('/user/:id', getUserById);
router.post('/user', createUser);
router.put('/user/:id', authenticateToken, updateUser);

module.exports = router;