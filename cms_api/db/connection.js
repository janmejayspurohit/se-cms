const { Sequelize } = require("sequelize");
const DB_CONFIG = require("./config");

const config = DB_CONFIG;
const rootSequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = rootSequelize;
