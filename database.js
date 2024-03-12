const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/url-shortener";

async function connectDb() {
   return await mongoose.connect(url);
}

module.exports = connectDb;
