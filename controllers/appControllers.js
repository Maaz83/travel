const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
var appModels = require("../models/appModels");
const pool = new Pool({
  user: "maaz",
  host: "localhost",
  database: "travel",
  password: "password",
  port: 5432,
});

function get_index(req, res, next) {
  res.render("index", {
    title: "Cool, huh!",
  });
}
function get_travel(req, res) {
  res.render("travel");
}
function get_signin(req, res) {
  res.render("signin");
}
function get_signup(req, res) {
  res.render("signup");
}
function get_home(req, res) {
  res.render("home");
}
async function login(req, res, next) {
  const { email, password } = req.body;
  req.check("email", "Invalid email address").isEmail();
  req.check("password", "Password is invalid").isLength({ min: 4 });
  var errors = req.validationErrors();
  if (errors) {
    res.render("signin", { error: "bad user name or password" });
  } else {
    appModels.find_user(email, (user) => {
      if (user != undefined) {
        // If there is already a user with that email
        // Load hashed password and compare it with entered password
        const dbPassword = user.password;
        console.log("password:", password);
        console.log("dbPassword:", dbPassword);
        bcrypt.compare(password, dbPassword, function (err, result) {
          if (result == true) {
            // If passwords match
            req.session.isAuth = true;
            req.session.userEmail = email;
            req.session.username = user.username;
            console.log("Login successful.");
            res.render("home", { success: true, user: user.username });
          } else {
            res.render("signin", { error: "bad password" });
          }
        });
      } else {
        // A user with that email address does not exists
        const conflictError = "User credentials are not valid.";
        console.log(conflictError);
        response.render("login", { email, password, conflictError });
      }
    });
  }
}
async function register(req, res, next) {
  const { username, password, email, phonenumber } = req.body;
  console.log(
    "username:",
    username,
    "\n password:",
    password,
    " \n email:",
    email,
    "\n phone:",
    phonenumber
  );

  req
    .check("username", "Invalid username")
    .not()
    .matches(/^[0-9,'!&]+$/);
  req.check("email", "Invalid email address").isEmail();

  req.check("password", "Invalid Passwor").isLength({ min: 6, max: 12 });
  req
    .check("phonenumber", "Invalid Phone number")
    .isLength(12)
    .matches(/[0-9]/);

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("signup", { errors: errors[0].msg });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    appModels.find_user(email, (user) => {
      if (typeof user != "undefined") {
        console.log("user mail already exists");
        res.render("signup", { errors: "Email already exists" });
      } else {
        appModels.insert_user(
          username,
          email,
          hashedPassword,
          phonenumber,
          () => {
            req.session.isAuth = true;
            req.session.userEmail = email;
            req.session.username = username;
            console.log("Login successful.");
            res.render("home", { success: true, user: username });
          }
        );
      }
    });
  }

  // await pool.end();
}
function logout(request, response) {
  request.session.destroy((error) => {
    if (error) throw error;
    console.log("User logout.");
    response.redirect("/home");
  });
}
module.exports = {
  get_index,
  get_travel,
  get_signin,
  get_signup,
  get_home,
  login,
  logout,
  register,
};
