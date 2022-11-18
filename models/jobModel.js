const db = require("../db/jobAppDB");
const { DataTypes } = require("sequelize");

const jobSchema = {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    validate: {
      isIn: {
        args: [["applied", "rejected", "interview fixed", "interested", ""]],
        msg: "Not a valid state",
      },
    },
  },
  salary: {
    type: DataTypes.INTEGER,
  },
};

const jobModel = db.define("Jobs", jobSchema);

module.exports = jobModel;
