const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

async function connectDb() {
   return await mongoose.connect(url);
}

module.exports = connectDb;
