const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/register", indexController.registerGet);
indexRouter.post("/register", indexController.registerPost);
indexRouter.get("/login", indexController.loginGet);
indexRouter.post("/login", indexController.loginPost);
indexRouter.use(indexController.isAuth);
indexRouter.get("/logout", indexController.logout);
indexRouter.get("/join", indexController.joinGet);
indexRouter.post("/join-club", indexController.joinClubPost);
indexRouter.post("/join-club", indexController.joinAdminPost);

module.exports = indexRouter;
