const jwt = require("jsonwebtoken");
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

module.exports = verifyUser;
