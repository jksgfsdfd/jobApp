const CustomAPIError = require("../errors/customAPIError");
function errorHandler(err, req, res, next) {
  if (err instanceof CustomAPIError) {
    res.status(err.statusCode).json({ Error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ Error: "Sorry there was an error try later" });
}

module.exports = errorHandler;
