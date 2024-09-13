const router = require("express").Router();
const urlController = require("../controllers/url.controller");

router.post("/", urlController.handleGenerateNewShortUrl);

router.get("/:shortId", urlController.handleRedirectUrl);

router.get("/analytics/:shortId", urlController.handleGetAnalytics);

router.get("/", urlController.handleGetAllUrls);

module.exports = router;
