const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
   {
      shortId: {
         type: String,
         required: true,
         unique: true,
      },
      redirectURL: {
         type: String,
         required: true,
      },
      history: [
         {
            time: {
               type: Number,
            },
         },
      ],
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   },
   { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
