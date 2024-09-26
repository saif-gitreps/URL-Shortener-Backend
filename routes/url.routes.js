const router = require("express").Router();
const urlController = require("../controllers/url.controller");
const { protectRoute } = require("../middlewares/auth");
const { body, param } = require("express-validator");

const validateCustomShortUrl = [
   body("url").isURL().withMessage("Invalid URL"),
   body("shortId")
      .isLength({ max: 6 })
      .withMessage("ShortId cannot be longer than 6 characters"),
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

// Todo: add more features for this Endpoint.
router.get("/analytics/:shortId", protectRoute, urlController.handleGetAnalytics);

module.exports = router;
