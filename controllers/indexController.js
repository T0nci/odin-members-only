const asyncHandler = require("express-async-handler");

const registerGet = asyncHandler(async (req, res) => {
  res.render("register");
});

module.exports = {
  registerGet,
};
