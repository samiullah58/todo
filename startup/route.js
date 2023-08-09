const express = require("express");
const task = require("../routes/tasks");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/tasks", task);
};
