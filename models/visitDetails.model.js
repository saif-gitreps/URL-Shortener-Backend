const mongoose = require("mongoose");

const visitDetailsSchema = new mongoose.Schema(
   {
      shortId: {
         type: String,
         required: true,
         index: true,
      },
      browser: String,
      os: String,
      device: String,
      country: { type: String, default: "Unknown" },
      region: { type: String, default: "Unknown" },
      city: { type: String, default: "Unknown" },
      referrer: { type: String, default: "direct" },
   },
   { timestamps: true }
);

const VisitDetails = mongoose.model("VisitDetails", visitDetailsSchema);

module.exports = VisitDetails;
