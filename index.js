const express = require("express");
const urlRoutes = require("./routes/url.routes");
const connectDb = require("./database");

const app = express();

app.use(express.json());

app.use(urlRoutes);

connectDb()
   .then(
      app.listen(3000, () => {
         console.log("MongoDb connected and Server is running on port 3000");
      })
   )
   .catch((e) => {
      console.error(e);
   });
