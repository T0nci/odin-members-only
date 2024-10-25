const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Messages } = require("../db/queries");
const links = require("../utils/links");

const messageCreateGet = (req, res) => {
  res.render("messageForm", { links });
};

module.exports = {
  messageCreateGet,
};
