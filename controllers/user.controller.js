const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const URL = require("../models/url.model");
const { setUser } = require("../services/auth");
const { validationResult } = require("express-validator");
const { ObjectId } = require("mongoose").Types;

async function handleUserSignup(req, res, next) {
   try {
      const { name, email, password } = req.body;

      const validationError = validationResult(req);

      if (validationError.errors.length)
         return res
            .status(400)
            .json({ validationErrors: validationError.errors.map((error) => error.msg) });

      const existingUser = await User.findOne({ email });

      if (existingUser) return res.status(400).json({ message: "User already exists." });

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
         name,
         email,
         password: hashedPassword,
      });

      return res.status(201).json({ message: "User created successfully." });
   } catch (error) {
      console.error(error);
      next(error);
   }
}

async function handleUserLogin(req, res, next) {
   try {
      const { email, password } = req.body;

      const validationError = validationResult(req);

      if (validationError.errors.length)
         return res
            .status(400)
            .json({ validationErrors: validationError.errors.map((error) => error.msg) });

      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password)))
         return res.status(401).json({ message: "Invalid email or password." });

      const token = setUser(user);

      res.cookie("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({ message: "User logged in successfully." });
   } catch (error) {
      console.error(error);
      next(error);
   }
}

const handleGetAllUrls = async (req, res, next) => {
   const userId = new ObjectId(req.user._id);

   try {
      const urls = await URL.aggregate([
         {
            $match: {
               createdBy: userId,
            },
         },
         {
            $lookup: {
               from: "visitdetails",
               localField: "shortId",
               foreignField: "shortId",
               as: "visitDetails",
               pipeline: [
                  {
                     $project: {
                        userAgent: 1,
                        location: 1,
                        referrer: 1,
                        createdAt: 1,
                     },
                  },
               ],
            },
         },
         {
            $addFields: {
               visitCount: { $size: "$visitDetails" },
            },
         },
         {
            $project: {
               _id: 1,
               shortId: 1,
               redirectURL: 1,
               createdBy: 1,
               createdAt: 1,
               visitDetails: 1,
               visitCount: 1,
            },
         },
      ]);

      return res.status(200).json({ urls });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

const handleUserLogout = async (req, res) => {
   res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
   });
   return res.status(200).json({ message: "User logged out successfully." });
};

module.exports = {
   handleUserSignup,
   handleUserLogin,
   handleGetAllUrls,
   handleUserLogout,
};
