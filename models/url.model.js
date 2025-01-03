const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
   {
      shortId: {
         type: String,
         required: true,
         unique: true,
         index: true,
      },
      redirectURL: {
         type: String,
         required: true,
      },
      expiresAt: {
         type: Date,
         required: false,
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: false,
      },
   },
   { timestamps: true }
);

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
