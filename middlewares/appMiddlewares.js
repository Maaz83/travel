function isNotAuth(request, response, next) {
  if (request.session.isAuth) {
    next();
  } else {
    response.redirect("/signin");
  }
}

// User is authenticated
function isAuth(request, response, next) {
  if (request.session.isAuth) {
    response.render("home", { user: request.session.username, success: true });
  } else {
    next();
  }
}

// Current user
function currentUser(request, response, next) {
  if (request.session.userEmail) {
    response.locals.userEmail = request.session.userEmail;
    next();
  } else {
    response.locals.userEmail = null;
    next();
  }
}

module.exports = { isNotAuth, isAuth, currentUser };
