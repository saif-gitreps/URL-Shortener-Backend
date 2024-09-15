const shortid = require("shortid");
const URL = require("../models/url.model");
const { ObjectId } = require("mongoose").Types;

const handleGenerateNewRandomShortUrl = async (req, res) => {
   const shortId = shortid();

   if (!req.body.url) {
      return res.status(400).json({ message: "redirectURL is required" });
   }
   await URL.create({
      shortId,
      redirectURL: req.body.url,
      visitedHistory: [],
      createdBy: req?.user?._id || null,
   });

   res.status(200).json({ shortId });
};

const handleRedirectUrl = async (req, res) => {
   const shortId = req.params.shortId;
   try {
      const url = await URL.findOneAndUpdate(
         {
            shortId,
         },
         {
            $push: {
               history: {
                  time: Date.now(),
               },
            },
         }
      );

      if (!url) {
         return res.status(404).json({ message: "URL not found" });
      }

      return res.redirect(url.redirectURL);
   } catch (error) {
      console.log(error);
      throw new Error("Error while redirecting to the URL.");
   }
};

const handleGetAnalytics = async (req, res) => {
   const shortId = req.params.shortId;
   try {
      const urlData = await URL.findOne({ shortId });

      if (!urlData) {
         return res.status(404).json({ message: "URL not found" });
      }

      return res.status(200).json({
         urlClicks: urlData.history.length,
         urlData,
      });
   } catch (error) {
      console.log(error);
      throw new Error("Error while getting analytics");
   }
};

const handleGenerateCustomShortUrl = async (req, res) => {
   const { url, shortId } = req.body;

   if (!url || !shortId) {
      return res.status(400).json({ message: "URL and shortId are required" });
   }

   const existingUrl = await URL.findOne({ shortId });

   if (existingUrl) return res.status(400).json({ message: "ShortId already exists" });

   await URL.create({
      shortId,
      redirectURL: url,
      visitedHistory: [],
      createdBy: req.user._id,
   });

   return res.status(200).json({ shortId });
};

const handleDeleteUrl = async (req, res) => {
   const shortId = req.params.shortId;

   if (!shortId) return res.status(400).json({ message: "shortId is required" });

   const url = await URL.findOne({ shortId });

   const userId = req.user._id;

   if (userId != url.createdBy) return res.status(401).json({ message: "Unauthorized" });

   await URL.findOneAndDelete({ shortId });

   return res.status(200).json({ message: "URL deleted successfully" });
};

module.exports = {
   handleGenerateNewRandomShortUrl,
   handleGenerateCustomShortUrl,
   handleRedirectUrl,
   handleGetAnalytics,
   handleDeleteUrl,
};
