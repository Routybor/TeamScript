const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const RateLimit = require('express-rate-limit');

const limiter = RateLimit({
  windowMs: 60 * 1000,
  max: 50000,
});

const configureMiddlewares = (app) => {
  app.use(cors());
  app.use(limiter);
  app.use(bodyParser.json());
};

module.exports = configureMiddlewares;
