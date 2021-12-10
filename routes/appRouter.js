var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var appController = require("../controllers/appControllers");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var {
  isNotAuth,
  isAuth,
  currentUser,
} = require("../middlewares/appMiddlewares.js");
/* GET home page. */
router.get("/", appController.get_index);

router.get("/travel", isNotAuth, currentUser, appController.get_travel);

router.get("/signin", isAuth, currentUser, appController.get_signin);

router.get("/signup", isAuth, currentUser, appController.get_signup);

router.get("/home", isAuth, currentUser, appController.get_home);

router.post("/login", urlencodedParser, appController.login);

router.post("/register", urlencodedParser, appController.register);

router.get("/logout", appController.logout);
module.exports = router;
