const jwt = require("jsonwebtoken");

function setAccessToken(user) {
   try {
      return jwt.sign(
         {
            email: user.email,
            _id: user._id,
            role: user.role,
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn: 60 * 15,
         }
      );
   } catch (error) {
      console.log(error);
      return null;
   }
}

function setRefreshToken(user) {
   try {
      return jwt.sign(
         {
            email: user.email,
            _id: user._id,
            role: user.role,
         },
         process.env.REFRESH_TOKEN_SECRET,
         {
            expiresIn: 60 * 60 * 24 * 7,
         }
      );
   } catch (error) {
      console.log(error);
      return null;
   }
}

module.exports = {
   setAccessToken,
   setRefreshToken,
};
