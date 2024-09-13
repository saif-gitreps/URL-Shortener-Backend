const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/", userController.handleUserSignup);
router.post("/login", userController.handleUserLogin);

module.exports = router;
