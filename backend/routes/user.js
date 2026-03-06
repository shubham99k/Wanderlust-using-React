const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");

// signup form render route
router.get("/signup", userController.renderSignupForm);

// signup form submit route
router.post("/signup", wrapAsync(userController.signup));

// login form render route
router.get("/login", userController.renderLoginForm);

// login form submit route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Invalid username or password" });
    req.login(user, (err) => {
      if (err) return next(err);
      return userController.login(req, res);
    });
  })(req, res, next);
});

//logout route
router.get("/logout", userController.logout);

// user profile route
router.get("/users/me", isLoggedIn, wrapAsync(userController.getProfile));


module.exports = router;