const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/customAPIError");
require("dotenv").config();
const jobModel = require("../models/jobModel");

function verifyUser(req, res, next) {
  const token = req.body.token;
  if (!token) {
    throw new CustomAPIError("You have to have a token to access jobs", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;
    req.username = username;
    next();
  } catch (error) {
    console.error(error);
    throw new CustomAPIError("Error processing token", 403);
  }
}

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
  } else {
    newObject.appliedDate = new Date().toISOString().split("T")[0];
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
  const username = req.username;
  const job = await jobModel.findAll({
    where: {
      username: username,
    },
    order: orderingQuery,
  });

  res
    .status(200)
    .json({ yourUsername: username, yourJobs: job, nbJobs: job.length });
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
  verifyUser,
};
