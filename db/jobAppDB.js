const { Sequelize } = require("sequelize");
require("dotenv").config();
const db = new Sequelize(
  process.env.DATABASE,
  process.env.DUSER,
  process.env.DPASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = db;
