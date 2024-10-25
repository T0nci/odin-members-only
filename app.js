require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("node:path");
const CustomError = require("./utils/CustomError");
const indexRouter = require("./routes/indexRouter");
const messageRouter = require("./routes/messageRouter");

const app = express();

// Ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Styles
app.use(express.static(path.join(__dirname, "public")));

// Form body parser
app.use(express.urlencoded({ extended: true }));

// Express session + passport setup
const { Pool } = require("pg");
const pgSession = require("connect-pg-simple")(session);
const pool = new Pool();
const sessionStore = new pgSession({ pool: pool });
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);
require("./utils/passport-setup");
app.use(passport.session());

app.use("/", indexRouter);
app.use("/messages", messageRouter);

app.use((req, res) => {
  res.status(404).render("error", { error: new CustomError(404, "Not Found") });
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.render("error", { error: err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Members Only listening on port ${PORT}!`));
