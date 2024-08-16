  const express = require('express');
  const userRoutes = require('./userRoutes');
  // const router = express.Router();
  // const userController = require('../controllers/userController');

  // router.post('/login', userController.login);
  // router.post('/register', userController.register);

  const router = express.Router();

  // users route
  router.use('/v1', userRoutes);

  module.exports = router;