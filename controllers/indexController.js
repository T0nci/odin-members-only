const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { Users } = require("../db/queries");
const links = require("../utils/links");

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
  body("confirmPassword")
    .trim()
    .custom((password, { req }) => {
      return password === req.body.password;
    })
    .withMessage("Passwords don't match."),
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must contain between 1 and 50 characters.")
    .isAlpha()
    .withMessage("First name must contain only letter from the alphabet"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must contain between 1 and 50 characters.")
    .isAlpha()
    .withMessage("Last name must contain only letter from the alphabet"),
];

const validateClubPassword = () =>
  body("password").custom((password) => password === process.env.CLUB_PASSWORD);

const validateAdminPassword = () =>
  body("password").custom(
    (password) => password === process.env.ADMIN_PASSWORD,
  );

const registerGet = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/messages");

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

const loginGet = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/messages");

  res.render("login");
});

const loginPost = passport.authenticate("local", {
  successRedirect: "/messages",
  failureRedirect: "/login",
});

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  res.redirect("/login");
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.redirect("/login");
  });
};

const joinGet = (req, res) => {
  res.render("join", { links, user: req.user });
};

const joinClubPost = [
  validateClubPassword(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.redirect("/join");

    if (req.user.role === "member" || req.user.role === "admin")
      return res.redirect("/join");

    await Users.setRole(req.user.id, 1);
    res.redirect("/join");
  }),
];

const joinAdminPost = [
  validateAdminPassword(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.redirect("/join");

    if (req.user.role === "admin") return res.redirect("/join");

    await Users.setRole(req.user.id, 2);
    res.redirect("/join");
  }),
];

module.exports = {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  isAuth,
  logout,
  joinGet,
  joinClubPost,
  joinAdminPost,
};
