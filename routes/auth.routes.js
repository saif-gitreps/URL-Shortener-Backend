const express = require("express");
const authControllers = require("../controllers/auth.controller");
const {
   protectRoute,
   authLimiter,
   validateLogin,
   validateSignup,
   verifyCSRFToken,
} = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", authLimiter, validateSignup, authControllers.handleUserSignup);

router.post("/login", authLimiter, validateLogin, authControllers.handleUserLogin);

router.post("/refresh-token", authControllers.handleRefreshAccessToken);

router.get("/csrf-token", authControllers.handleCSRFToken);

router.use(protectRoute);

router.get("/current-user", authControllers.handleGetCurrentUser);

router.use(verifyCSRFToken);

router.post("/logout", authControllers.handleUserLogout);

router.put("/update", authControllers.handleUpdateUser);

module.exports = router;
