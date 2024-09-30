const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");

const validateSignup = [
   body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
   body("email").isEmail().normalizeEmail().withMessage("Must be a valid email address"),
   body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter"),
];

const validateLogin = [
   body("email").isEmail().normalizeEmail().withMessage("Must be a valid email address"),
   body("password").notEmpty().withMessage("Password is required"),
];

const authLimiter = rateLimit({
   windowMs: 5 * 60 * 1000,
   max: 15,
   message: "Too many login/signup attemps, please try again after 5 minutes",
   headers: true,
   statusCode: 429,
});

function protectRoute(req, res, next) {
   const accessToken = req.cookies?.accessToken;

   if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

   try {
      const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      req.user = user;

      return next();
   } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
         return res.status(401).json({ message: "Access token expired" });

      return res.status(401).json({ message: "Invalid access token" });
   }
}

function addAuthUserDataToReqBody(req, res, next) {
   const accessToken = req.cookies?.accessToken;

   if (accessToken) {
      const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;
   } else {
      req.user = null;
   }

   return next();
}

function restrictTo(roles = []) {
   return function (req, res, next) {
      if (!req.user) return res.redirect("/login");

      if (!roles.includes(req.user.role))
         return res.end("You do not have permission to access this page.");

      return next();
   };
}

function verifyCSRFToken(req, res, next) {
   const csrfFromCookie = req.cookies["XSRF-TOKEN"];
   const csrfFromHeader = req.headers["x-xsrf-token"];

   // console.dir(req.cookies, { depth: null });
   // console.dir(req.headers, { depth: null });

   // console.log(csrfFromCookie, csrfFromHeader);

   if (!csrfFromCookie || !csrfFromHeader || csrfFromCookie !== csrfFromHeader) {
      return res.status(403).json({ message: "Invalid CSRF token" });
   }

   next();
}

module.exports = {
   protectRoute,
   restrictTo,
   addAuthUserDataToReqBody,
   authLimiter,
   validateSignup,
   validateLogin,
   verifyCSRFToken,
};
