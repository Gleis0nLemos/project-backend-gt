  const express = require('express');
  const userRoutes = require('./userRoutes');
  const categoryRoutes = require('./categoryRoutes');
  const productRoutes = require('./productRoutes')
  const router = express.Router();

  // users route
  router.use('/v1', userRoutes);

  // category route
  router.use('/v1', categoryRoutes);

  // product route
  router.use('/v1', productRoutes)

  module.exports = router;