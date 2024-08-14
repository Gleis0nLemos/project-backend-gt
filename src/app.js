const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes'); // import routes

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use('/api', routes);

module.exports = app;