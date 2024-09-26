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
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: false,
      },
   },
   { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
