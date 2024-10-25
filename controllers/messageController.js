const asyncHandler = require("express-async-handler");
const { body, validationResult, param } = require("express-validator");
const { Messages } = require("../db/queries");
const links = require("../utils/links");
const CustomError = require("../utils/CustomError");

const validateCreateMessage = () => [
  body("title")
    .trim()
    .custom((title) => /^[a-zA-Z0-9 ]+$/.test(title))
    .withMessage("Title must contain only letters of the alphabet and numbers.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must contain between 1 and 50 characters."),
  body("text")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Text must contain between 1 and 200 characters."),
];

const validateMessageId = () =>
  param("id").custom(async (id) => {
    const result = await Messages.getMessageById(Number(id));

    if (!result) throw false;
  });

const messagesGet = asyncHandler(async (req, res) => {
  const messages = await Messages.getAllMessages();
  res.render("messages", { links, user: req.user, messages });
});

const messageCreateGet = (req, res) => {
  res.render("messageForm", { links });
};

const messageCreatePost = [
  validateCreateMessage(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("messageForm", { links, errors: errors.array() });
    }

    await Messages.createMessage(req.body.title, req.body.text, req.user.id);
    res.redirect("/messages");
  }),
];

const messageDeletePost = [
  validateMessageId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new CustomError(400, "Message Not Found");

    await Messages.deleteMessageById(Number(req.params.id));
    res.redirect("/messages");
  }),
];

module.exports = {
  messagesGet,
  messageCreateGet,
  messageCreatePost,
  messageDeletePost,
};
