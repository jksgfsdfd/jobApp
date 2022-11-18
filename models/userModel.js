const { DataTypes } = require("sequelize");
const db = require("../db/jobAppDB");
const userSchema = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const userModel = db.define("Users", userSchema);

module.exports = userModel;
