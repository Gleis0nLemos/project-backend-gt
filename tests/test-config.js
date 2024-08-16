const path = require('path');
const configPath = path.resolve(__dirname, '../config/config.json');
const config = require(configPath);
console.log(config);
