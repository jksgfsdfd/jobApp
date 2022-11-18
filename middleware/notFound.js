function notFound(req, res) {
  res.status(404).json({ Error: "Route does not exist" });
}

module.exports = notFound;
