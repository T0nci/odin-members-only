const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { Users } = require("../db/queries");

const validateRegister = () => [
  body("username")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Username must contain between 1 and 30 characters.")
    .custom((username) => /^[a-zA-Z0-9._]+$/.test(username))
    .withMessage(
      "Username must contain only characters from the alphabet, numbers, '.' and '_'.",
    )
    .custom(async (username) => {
      const result = await Users.getUserByUsername(username);

      if (result) throw false;
    })
    .withMessage("Username already exists!"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage("Password must contain between 6 and 50 characters.")
    .custom((password) => {
      if (!/[a-z]/.test(password)) return false;
      if (!/[A-Z]/.test(password)) return false;
      if (!/[0-9]/.test(password)) return false;
      if (!/[`~!@#$%^&*()\-_=+{}[\]|\\;:'",<.>/?]/.test(password)) return false;
      return true;
    })
    .withMessage(
      "Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol.",
    ),
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First Name must contain between 1 and 50 characters.")
    .isAlpha()
    .withMessage("First Name must contain only letter from the alphabet"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last Name must contain between 1 and 50 characters.")
    .isAlpha()
    .withMessage("Last Name must contain only letter from the alphabet"),
];

const registerGet = asyncHandler(async (req, res) => {
  res.render("register");
});

const registerPost = [
  validateRegister(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", { errors: errors.array() });
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) throw err;

      await Users.createUser(
        req.body.username,
        hashedPassword,
        req.body.firstName,
        req.body.lastName,
      );

      res.redirect("/login");
    });
  }),
];

module.exports = {
  registerGet,
  registerPost,
};
