const jwt = require("jsonwebtoken");

function setUser(user) {
   try {
      return jwt.sign(
         {
            email: user.email,
            name: user.name,
            _id: user._id,
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "1h",
         }
      );
   } catch (error) {
      console.log(error);
      return null;
   }
}

function getUser(token) {
   if (!token) return null;

   try {
      return jwt.verify(token, process.env.JWT_SECRET);
   } catch (error) {
      console.log(error);
      return null;
   }
}

module.exports = {
   setUser,
   getUser,
};
