const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const CustomAPIError = require("../errors/customAPIError");
require("dotenv").config();
const jobModel = require("../models/jobModel");

async function createJob(req, res) {
  // username,companyname,role,status,salary
  //get user name from accesstoken
  const username = req.username;
  const {
    companyName,
    role,
    status,
    salary,
    companyType,
    description,
    jobLink,
    appliedDate,
    interest,
  } = req.body;
  const newObject = {};
  if (!companyName) {
    throw new CustomAPIError("Company Name must be provided", 302);
  }
  newObject.companyName = companyName;
  newObject.userName = username;
  if (role) {
    newObject.role = role;
  }
  if (salary) {
    newObject.salary = Number(salary);
  }
  if (status) {
    newObject.status = status;
  }
  if (companyType) {
    newObject.companyType = companyType;
  }

  if (description) {
    newObject.description = description;
  }
  if (jobLink) {
    newObject.jobLink = jobLink;
  }
  if (appliedDate) {
    newObject.appliedDate = appliedDate;
  }
  if (interest) {
    newObject.interest = interest;
  }
  await jobModel.create(newObject);
  res.status(200).json({ Message: "Job Created" });
}

async function viewJob(req, res) {
  const username = req.username;
  const jobId = req.params.id;
  const job = await jobModel.findOne({
    where: {
      id: jobId,
    },
  });

  if (job == null) {
    throw new CustomAPIError("No job with given Id", 303);
  }

  if (job.userName != username) {
    throw new CustomAPIError("You can only view your jobs", 401);
  }

  res.status(200).json(job);
}

async function viewAllJob(req, res) {
  let orderingQuery = [];
  if (req.query.sort) {
    let sort = req.query.sort;
    sort = sort.split(",");
    sort.forEach((element) => {
      if (element[0] == "-") {
        let temp = [element.slice(1), "DESC"];
        orderingQuery.push(temp);
      } else {
        let temp = [element, "ASC"];
        orderingQuery.push(temp);
      }
    });
  }

  console.log(orderingQuery);

  let filteringQuery = {};
  filteringQuery.userName = req.username;
  if (req.query.filter) {
    let filter = req.query.filter.split(",");
    //[salary>4 , name=hello ]
    /*
      {
        salary : {[op.gt] : 4},
        name : {[op.eq] : hello}
      }
    */
    const signMap = {
      "<": Op.lt,
      "<=": Op.lte,
      ">": Op.gt,
      ">=": Op.gte,
      "=": Op.eq,
    };
    const interestMap = {
      extreme: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    const signRegex = /\b(<|<=|>|>=|=)\b/;
    filter.forEach((element) => {
      console.log(element);
      let parts = element.replace(signRegex, (match) => {
        return `-${match}-`;
      });

      parts = parts.split("-");
      let thisPropertyFilter = {};
      console.log(parts[2]);
      if (parts[0] == "interest") {
        parts[2] = interestMap[parts[2]];
      }
      if (filteringQuery.hasOwnProperty(parts[0])) {
        filteringQuery[parts[0]][signMap[parts[1]]] = parts[2];
      } else {
        thisPropertyFilter[signMap[parts[1]]] = parts[2];
        filteringQuery[parts[0]] = thisPropertyFilter;
      }
    });
  }
  const job = await jobModel.findAll({
    where: filteringQuery,
    order: orderingQuery,
  });

  res
    .status(200)
    .json({ yourUsername: req.username, yourJobs: job, nbJobs: job.length });
}

async function editJob(req, res) {
  const username = req.username;
  const jobId = req.params.id;
  const update = req.body;
  delete update.token;
  const job = await jobModel.findOne({
    where: {
      id: jobId,
    },
  });

  if (job == null) {
    throw new CustomAPIError("No job with given Id", 303);
  }

  if (job.userName != username) {
    throw new CustomAPIError("You can only edit your jobs", 401);
  }

  await jobModel.update(update, {
    where: {
      id: jobId,
    },
  });
  res.status(200).json({ message: "Successfully updated" });
}

async function deleteJob(req, res) {
  const username = req.username;
  const jobId = req.params.id;

  const job = await jobModel.findOne({
    where: {
      id: jobId,
    },
  });

  if (job == null) {
    throw new CustomAPIError("No job with given Id", 303);
  }

  if (job.userName != username) {
    throw new CustomAPIError("You can only delete your jobs", 401);
  }

  await jobModel.destroy({
    where: {
      id: jobId,
    },
  });
  res.status(200).json({ message: "Successfully destroyed" });
}

module.exports = {
  viewAllJob,
  viewJob,
  createJob,
  deleteJob,
  editJob,
};
