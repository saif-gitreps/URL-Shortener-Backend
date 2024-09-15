const router = require("express").Router();
const urlController = require("../controllers/url.controller");
const { protectRoute } = require("../middlewares/auth");

router.post("/shorten", urlController.handleGenerateNewRandomShortUrl);

router.post("/custom-shorten", protectRoute, urlController.handleGenerateCustomShortUrl);

router.get("/:shortId", urlController.handleRedirectUrl);

router.delete("/:shortId", protectRoute, urlController.handleDeleteUrl);

router.get("/analytics/:shortId", protectRoute, urlController.handleGetAnalytics);

module.exports = router;
