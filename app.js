const express = require("express");
const morgan = require("morgan")

const app = express();
const { NotFoundError } = require('./expressErrors')

const itemRoutes = require("./itemRoutes");

app.use(express.json());

app.use(morgan('dev'));

app.use("/items", itemRoutes)

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

module.exports = app