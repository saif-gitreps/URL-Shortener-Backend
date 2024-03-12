const router = require("express").Router();
const urlController = require("../controllers/url.controller");

router.post("/url", urlController.handleGenerateNewShortUrl);

router.get("/:shortId", urlController.handleRedirectUrl);

router.get("/analytics/:shortId", urlController.handleGetAnalytics);

module.exports = router;
