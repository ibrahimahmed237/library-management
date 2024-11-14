const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(
    dbConfig[process.env.NODE_ENV].database,
    dbConfig[process.env.NODE_ENV].username,
    dbConfig[process.env.NODE_ENV].password,
    {
        host: dbConfig[process.env.NODE_ENV].host,
        dialect: dbConfig[process.env.NODE_ENV].dialect,
        logging: dbConfig[process.env.NODE_ENV].logging || console.log,
    }
);

module.exports = sequelize;
