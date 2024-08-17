  const express = require('express');
  const userRoutes = require('./userRoutes');
  const router = express.Router();

  // users route
  router.use('/v1', userRoutes);

  module.exports = router;