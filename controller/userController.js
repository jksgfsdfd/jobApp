const CustomAPIError = require("../errors/customAPIError");
const userModel = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await userModel.findOne({ where: { username: username } });
  if (user === null) {
    throw new CustomAPIError("Username not found", 403);
  }
  if (user.password == password) {
    //password is correct he has access to jobs
    //to do this we can send him a jwt
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ Message: "has access", Token: accessToken });
  } else {
    throw new CustomAPIError("Wrong Password", 403);
  }
}

async function signupUser(req, res) {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    throw new CustomAPIError("Fill All Three Fields", 402);
  }
  const user = await userModel.findOne({ where: { username: username } });
  if (user === null) {
    //we can create a new user
    await userModel.create({
      name: name,
      username: username,
      password: password,
    });
    res.json({ Message: "User Created Please Login" });
  } else {
    throw new CustomAPIError("Username already taken", 301);
  }
}

module.exports = {
  loginUser,
  signupUser,
};
