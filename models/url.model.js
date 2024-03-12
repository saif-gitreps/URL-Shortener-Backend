const mongoose = require("monngoose");

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
      visitHisotry: [
         {
            timestamps: {
               type: Number,
            },
         },
      ],
   },
   { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
