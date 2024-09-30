const router = require("express").Router();
const urlController = require("../controllers/url.controller");
const { protectRoute, verifyCSRFToken } = require("../middlewares/auth");
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

router.use(protectRoute);

router.post(
   "/custom-shorten",
   verifyCSRFToken,
   validateCustomShortUrl,
   urlController.handleGenerateCustomShortUrl
);

router.delete("/:shortId", verifyCSRFToken, urlController.handleDeleteUrl);

// Todo: add more features for this Endpoint.
router.get("/:shortId/analytics", urlController.handleGetAnalytics);

module.exports = router;
