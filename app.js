require("dotenv").config();
const express = require("express");
const path = require("node:path");
const CustomError = require("./utils/CustomError");
const indexRouter = require("./routes/indexRouter");

const app = express();

// Ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Styles
app.use(express.static(path.join(__dirname, "public")));

// Form body parser
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

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
