const express = require("express");
const userController = require("../controllers/user.controller");
const { protectRoute } = require("../middlewares/auth");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");

const validateSignup = [
   body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
   body("email").isEmail().normalizeEmail().withMessage("Must be a valid email address"),
   body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter"),
];

const validateLogin = [
   body("email").isEmail().normalizeEmail().withMessage("Must be a valid email address"),
   body("password").notEmpty().withMessage("Password is required"),
];

const authLimiter = rateLimit({
   windowMs: 5 * 60 * 1000,
   max: 5,
   message: "Too many login/signup attemps, please try again after 5 minutes",
   headers: true,
   statusCode: 429,
});

const router = express.Router();

router.get("/analytics", protectRoute, userController.handleGetAllUrls);

router.use(authLimiter);

router.post("/signup", validateSignup, userController.handleUserSignup);

router.post("/login", validateLogin, userController.handleUserLogin);

router.post("/logout", protectRoute, userController.handleUserLogout);

module.exports = router;
