const express = require('express');
const router = express.Router();
const { authenticateUser, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// route to authenticate user and generate token
router.post('/auth/login', authenticateUser);

// other routes
router.get('/user/:id', getUserById);
router.post('/user', createUser);
router.put('/user/:id', authenticateToken, updateUser);
router.delete('/user/:id', authenticateToken, deleteUser);

module.exports = router;