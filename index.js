require("dotenv").config();
const express = require("express");
const connectDb = require("./database");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const urlRoutes = require("./routes/url.routes");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/", urlRoutes);
app.use("/api/user", userRoutes);

connectDb()
   .then(
      app.listen(3000, () => {
         console.log("MongoDb connected and Server is running on port 3000");
      })
   )
   .catch((e) => {
      console.error(e);
   });
