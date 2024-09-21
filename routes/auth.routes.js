const express = require("express");
const authControllers = require("../controllers/auth.controller");
const {
   protectRoute,
   authLimiter,
   validateLogin,
   validateSignup,
} = require("../middlewares/auth");

const router = express.Router();

router.use(authLimiter);

router.post("/signup", validateSignup, authControllers.handleUserSignup);

router.post("/login", validateLogin, authControllers.handleUserLogin);

router.post("/logout", protectRoute, authControllers.handleUserLogout);

router.post("/refresh-token", protectRoute, authControllers.handleRefreshAccessToken);

router.put("/update", protectRoute, authControllers.handleUpdateUser);

router.get("/current-user", protectRoute, authControllers.handleGetCurrentUser);

module.exports = router;
