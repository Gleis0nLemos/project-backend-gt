const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes'); // import routes
const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(routes);

module.exports = app;