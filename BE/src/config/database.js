const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // database name
  process.env.DB_USER,      // username
  process.env.DB_PASS,      // password
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',       // hoặc 'mariadb' nếu dùng MariaDB
    logging: false,         // tắt log SQL
  }
);

module.exports = sequelize;
