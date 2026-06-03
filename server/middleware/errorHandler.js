function errorHandler(err, req, res, next) {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
