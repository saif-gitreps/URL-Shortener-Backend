const express = require("express");
const connectDb = require("./database");
const path = require("path");
const cookieParser = require("cookie-parser");
const { protectRoutes } = require("./middlewares/auth");

const userRoutes = require("./routes/user.routes");
const staticRoutes = require("./routes/staticRouter");
const urlRoutes = require("./routes/url.routes");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/", staticRoutes);
app.use("/url", protectRoutes, urlRoutes);
app.use("/user", userRoutes);

connectDb()
   .then(
      app.listen(3000, () => {
         console.log("MongoDb connected and Server is running on port 3000");
      })
   )
   .catch((e) => {
      console.error(e);
   });
