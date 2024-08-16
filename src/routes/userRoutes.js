const express = require('express');
const router = express.Router();
const { getUserById, createUser } = require('../controllers/userController');

router.get('/user/:id', getUserById);
router.post('/user', createUser);

module.exports = router;