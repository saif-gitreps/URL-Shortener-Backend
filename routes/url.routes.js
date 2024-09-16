const router = require("express").Router();
const urlController = require("../controllers/url.controller");
const { protectRoute } = require("../middlewares/auth");
const { body, param } = require("express-validator");

const validateCustomShortUrl = [
   body("url").isURL().withMessage("Invalid URL"),
   body("shortId")
      .isLength({ min: 5 })
      .withMessage("ShortId must be at least 5 characters long"),
];

router.post(
   "/shorten",
   [body("url").isURL().withMessage("Invalid URL")],
   urlController.handleGenerateNewRandomShortUrl
);

router.post(
   "/custom-shorten",
   protectRoute,
   validateCustomShortUrl,
   urlController.handleGenerateCustomShortUrl
);

router.get("/:shortId", urlController.handleRedirectUrl);

router.delete("/:shortId", protectRoute, urlController.handleDeleteUrl);

router.get("/analytics/:shortId", protectRoute, urlController.handleGetAnalytics);

module.exports = router;
