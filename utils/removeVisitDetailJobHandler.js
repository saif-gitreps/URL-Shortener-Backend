const URL = require("../models/url.model");
const VisitDetails = require("../models/visitDetails.model");

const removeVisitDetailsJobHandler = async () => {
   console.log("Running cleanup task...");

   try {
      const expiredUrls = await URL.find({ expiresAt: { $lte: new Date() } });

      if (expiredUrls.length > 0) {
         const shortIds = expiredUrls.map((url) => url.shortId);

         await VisitDetails.deleteMany({ shortId: { $in: shortIds } });

         await URL.deleteMany({ shortId: { $in: shortIds } });

         console.log(
            `Deleted ${expiredUrls.length} expired URLs and their visit details.`
         );
      }
   } catch (error) {
      console.error("Error during cleanup task:", error);
   }
};

module.exports = removeVisitDetailsJobHandler;
