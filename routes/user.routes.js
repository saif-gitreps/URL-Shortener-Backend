const express = require("express");
const userController = require("../controllers/user.controller");
const { protectRoute } = require("../middlewares/auth");

const router = express.Router();

router.get("/analytics", protectRoute, userController.handleGetAllUrls);

module.exports = router;
