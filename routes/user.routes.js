const express = require("express");
const userController = require("../controllers/user.controller");
const { protectRoute } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", userController.handleUserSignup);

router.post("/login", userController.handleUserLogin);

router.post("/logout", protectRoute, userController.handleUserLogout);

router.get("/analytics", protectRoute, userController.handleGetAllUrls);

module.exports = router;
