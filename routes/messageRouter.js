const { Router } = require("express");
const messageController = require("../controllers/messageController");

const messageRouter = Router();

// messageRouter.get("/", messageController.messagesGet);
messageRouter.get("/create", messageController.messageCreateGet);
messageRouter.post("/create", messageController.messageCreatePost);

module.exports = messageRouter;
