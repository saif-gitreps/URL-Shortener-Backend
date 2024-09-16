const mongoose = require("mongoose");

const visitDetailsSchema = new mongoose.Schema(
   {
      shortId: {
         type: String,
         required: true,
         index: true,
      },
      userAgent: {
         browser: { name: String, version: String },
         os: { name: String, version: String },
         device: { type: String },
         cpu: { architecture: String, cores: Number, model: String },
      },
      location: {
         country: { type: String, default: "Unknown" },
         region: { type: String, default: "Unknown" },
         timezone: { type: String, default: "Unknown" },
         city: { type: String, default: "Unknown" },
      },
      referrer: { type: String, default: "direct" },
   },
   { timestamps: true }
);

const VisitDetails = mongoose.model("VisitDetails", visitDetailsSchema);

module.exports = VisitDetails;
