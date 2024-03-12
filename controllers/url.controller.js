const shortid = require("shortid");
const URL = require("../models/url.model");

const handleGenerateNewShortUrl = async (req, res) => {
   const shortId = shortid();

   if (!req.body.redirectURL) {
      return res.status(400).json({ message: "redirectURL is required" });
   }
   await URL.create({
      shortId,
      redirectURL: req.body.redirectURL,
      visitedHistory: [],
   });

   return res.status(201).json({ shortId });
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

module.exports = {
   handleGenerateNewShortUrl,
   handleRedirectUrl,
   handleGetAnalytics,
};
