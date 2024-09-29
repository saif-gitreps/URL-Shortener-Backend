const shortid = require("shortid");
const URL = require("../models/url.model");
const VisitDetails = require("../models/visitDetails.model");
const UAParser = require("ua-parser-js");
const sanitizeInput = require("../utils/sanitizeInput");
require("util").inspect.defaultOptions.depth = null;
const geoip = require("geoip-lite");
const { validationResult } = require("express-validator");

const createUrl = async (shortId, redirectURL, userId) => {
   return URL.create({
      shortId,
      redirectURL,
      visitedHistory: [],
      createdBy: userId || null,
   });
};

const handleGenerateNewRandomShortUrl = async (req, res, next) => {
   try {
      const shortId = shortid();

      req.body = sanitizeInput(req.body);

      if (!req.body.url) {
         return res.status(400).json({ message: "redirectURL is required" });
      }

      const validationError = validationResult(req);

      if (validationError.errors.length)
         return res.status(400).json({
            message: `${validationError.errors.map((error) => error.msg).join(", ")}`,
         });

      if (!/^https?:\/\//i.test(req.body.url)) {
         return res.status(400).json({ message: "Invalid redirect URL format" });
      }

      await createUrl(shortId, req.body.url, req.user?._id);

      res.status(200).json({ shortId });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

const handleGenerateCustomShortUrl = async (req, res, next) => {
   try {
      const { url, shortId } = req.body;

      const validationError = validationResult(req);

      if (validationError.errors.length)
         return res.status(400).json({
            message: `${validationError.errors.map((error) => error.msg).join(", ")}`,
         });

      if (!/^https?:\/\//i.test(req.body.url)) {
         return res.status(400).json({ message: "Invalid redirect URL format" });
      }

      if (!url || !shortId) {
         return res.status(400).json({ message: "URL and shortId are required" });
      }

      const existingUrl = await URL.findOne({ shortId });

      if (existingUrl) {
         return res.status(400).json({ message: "ShortId already exists" });
      }

      await createUrl(shortId, url, req.user._id);

      return res.status(200).json({ shortId });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

const handleRedirectUrl = async (req, res, next) => {
   try {
      const shortId = req.params.shortId;
      const url = await URL.findOne({ shortId });

      if (!url) {
         return res.status(404).json({ message: "URL not found" });
      }

      const userAgent = new UAParser().setUA(req.headers["user-agent"]).getResult();
      const referrer = req.headers["referer"] || "direct";
      const IPAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const geo = geoip.lookup(IPAddress);

      const visitDetails = new VisitDetails({
         shortId,
         userAgent: {
            browser: {
               name: userAgent.browser?.name,
               version: userAgent.browser?.version,
            },
            os: { name: userAgent.os?.name, version: userAgent.os?.version },
            device: userAgent.device?.type || "desktop",
            cpu: userAgent.cpu,
         },
         location: {
            country: geo?.country || "Unknown",
            region: geo?.region || "Unknown",
            timezone: geo?.timezone || "Unknown",
            city: geo?.city || "Unknown",
         },
         referrer,
      });

      await visitDetails.save();

      return res.redirect(url.redirectURL);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

const handleGetAnalytics = async (req, res, next) => {
   try {
      const shortId = req.params.shortId;
      const urlData = await URL.findOne({ shortId });

      if (!urlData) {
         return res.status(404).json({ message: "URL not found" });
      }

      const analytics = await VisitDetails.find({ shortId }, {});

      // TODO: Add different analytics data api, this is a simple click analytics.
      return res.status(200).json({
         urlClicks: analytics?.length,
         urlData,
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

const handleDeleteUrl = async (req, res, next) => {
   try {
      const shortId = req.params.shortId;

      if (!shortId) {
         return res.status(400).json({ message: "shortId is required" });
      }

      const url = await URL.findOne({ shortId });

      if (!url) {
         return res.status(404).json({ message: "URL not found" });
      }

      const userId = req.user._id;

      if (userId != url.createdBy) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      await URL.findOneAndDelete({ shortId });

      return res.status(200).json({ message: "URL deleted successfully" });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

module.exports = {
   handleGenerateNewRandomShortUrl,
   handleGenerateCustomShortUrl,
   handleRedirectUrl,
   handleGetAnalytics,
   handleDeleteUrl,
};
