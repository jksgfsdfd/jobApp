const CustomAPIError = require("../errors/customAPIError");
function errorHandler(err, req, res, next) {
  if (err instanceof CustomAPIError) {
    res.status(err.statusCode).json({ Error: err.message });
    return;
  }
  if (err.name == "SequelizeValidationError") {
    res.status(400).json({
      Error: err.errors.map((e) => {
        return e.message;
      }),
    });
    return;
  }
  console.error(err);
  res.status(500).json({ Error: "Sorry there was an error try later" });
}

module.exports = errorHandler;
