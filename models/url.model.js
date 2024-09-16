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
         validate: {
            validator: function (v) {
               return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
                  v
               );
            },
            message: (props) => `${props.value} is not a valid URL!`,
         },
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
