const { getUser } = require("../services/auth");

function protectRoute(req, res, next) {
   const authorizationToken = req.cookies?.token;

   req.user = null;

   if (!authorizationToken) return res.status(401).json({ message: "Unauthorized" });

   const user = getUser(authorizationToken);

   req.user = user;

   return next();
}

function addAuthUserDataToReqBody(req, res, next) {
   const authorizationToken = req.cookies?.token;

   if (authorizationToken) req.user = getUser(authorizationToken);

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

module.exports = { protectRoute, restrictTo, addAuthUserDataToReqBody };
