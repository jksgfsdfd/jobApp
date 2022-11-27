const db = require("../db/jobAppDB");
const userModel = require("./userModel");
const validator = require("validator");
const { Sequelize, DataTypes, Op } = require("sequelize");
const CustomAPIError = require("../errors/customAPIError");

const jobSchema = {
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyType: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: {
        args: [["STARTUP", "MNC"]],
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
        args: [["APPLIED", "REJECTED", "INTERVIEW_FIXED", "INTERESTED"]],
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
    defaultValue: Sequelize.literal("(CURRENT_DATE())"),
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
  interest: {
    type: DataTypes.ENUM,
    values: ["low", "medium", "high", "extreme"],
  },
};
const tableProperties = { timestamps: false };
const jobModel = db.define("Jobs", jobSchema, tableProperties);
/*
userModel.hasMany(jobModel, {
  sourceKey: "username",
  foreignKey: "userName",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
*/
//allows the jobModel to get methods to access the foreign data
jobModel.belongsTo(userModel, {
  targetKey: "username",
  foreignKey: "userName",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
module.exports = jobModel;
