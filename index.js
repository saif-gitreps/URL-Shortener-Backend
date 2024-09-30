require("dotenv").config();
const express = require("express");
const connectDb = require("./database");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const urlRoutes = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const countRequests = require("./middlewares/requestLogger");
const { addAuthUserDataToReqBody } = require("./middlewares/auth");
const { handleRedirectUrl } = require("./controllers/url.controller");

const app = express();

app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true,
      optionsSuccessStatus: 200,
   })
);

const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: (req, res) => (req.user?.role === "admin" ? 100 : 60),
   message: "Too many requests from this IP, please try again after 15 minutes",
   headers: true,
   statusCode: 429,
});

const helmetContentSecurityPolicy = helmet.contentSecurityPolicy({
   directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
   },
});

app.use(countRequests);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmetContentSecurityPolicy);
app.use(addAuthUserDataToReqBody);

app.get("/:shortId", handleRedirectUrl);

app.use("/api/url", urlRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ message: "Internal Server Error" });
});

const startServer = async () => {
   try {
      await connectDb();
      app.listen(PORT, () => {
         console.log("MongoDb connected and Server is running on port 3000");
      });
   } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
   }
};

startServer();
