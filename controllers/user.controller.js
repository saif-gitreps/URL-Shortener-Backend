const User = require("../models/user.model");
const URL = require("../models/url.model");
const { setUser, getUser } = require("../services/auth");

async function handleUserSignup(req, res) {
   const { name, email, password } = req.body;

   const user = await User.findOne({ email });

   if (user) {
      return res.json({ message: "User already exists." });
   }

   await User.create({
      name,
      email,
      password,
   });

   return res.json({ message: "User created successfully." });
}

async function handleUserLogin(req, res) {
   const { email, password } = req.body;

   const user = await User.findOne({ email, password });

   if (!user) {
      return res.json({ message: "Invalid email or password." });
   }

   const token = setUser(user);

   res.cookie("token", token);

   return res.json({ message: "User logged in successfully." });
}

const handleGetAllUrls = async (req, res) => {
   try {
      const user = req.user;

      const urls = await URL.find({ createdBy: user._id });

      return res.status(200).json({ urls });
   } catch (error) {
      console.log(error);
      throw new Error("Error while getting all URLs");
   }
};

const handleUserLogout = async (req, res) => {
   res.clearCookie("token");

   return res.json({ message: "User logged out successfully." });
};

module.exports = {
   handleUserSignup,
   handleUserLogin,
   handleGetAllUrls,
   handleUserLogout,
};
