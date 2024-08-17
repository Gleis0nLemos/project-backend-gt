  const express = require('express');
  const userRoutes = require('./userRoutes');
  const categoryRoutes = require('./categoryRoutes')
  const router = express.Router();

  // users route
  router.use('/v1', userRoutes);

  // category route
  router.use('/v1', categoryRoutes);

  module.exports = router;