const express = require("express");
var HTTP_PORT = process.env.PORT || 8080;

var routes = require("./routes/appRouter");


const app = express();
const path = require("path");

var hbs = require("express-handlebars");

var expressValidator = require("express-validator");

const session = require("express-session");
app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: "secret",
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false,
  })
);

app.use(expressValidator());

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use("/", routes);

app.use(express.static(path.join(__dirname, "public")));

app.listen(HTTP_PORT, () => {
  console.log("Application listening on port 8080!");
});
