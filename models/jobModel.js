const db = require("../db/jobAppDB");
const validator = require("validator");
const { Sequelize, DataTypes, Op } = require("sequelize");
const CustomAPIError = require("../errors/customAPIError");

const jobSchema = {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyType: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: {
        args: [["startup", "mnc"]],
        msg: "Provide valid company type",
      },
    },
  },
  role: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: {
        args: [["applied", "rejected", "interview fixed", "interested"]],
        msg: "Provide valid job status",
      },
    },
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  appliedDate: {
    type: DataTypes.DATEONLY,
    //defaultValue: Sequelize.fn("now"),
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jobLink: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      urlOrEmail(link) {
        if (!validator.isEmail(link) && !validator.isURL(link)) {
          throw new CustomAPIError("enter email or link of the job", 301);
        }
      },
    },
  },
};

const jobModel = db.define("Jobs", jobSchema);

module.exports = jobModel;
