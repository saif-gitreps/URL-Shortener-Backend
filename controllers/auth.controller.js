const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { setAccessToken, setRefreshToken } = require("../services/auth");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

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

      const accessToken = setAccessToken(user);
      const refreshToken = setRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("accessToken", accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         // path: "/api/auth/refresh-token",
         maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: "User logged in successfully." });
   } catch (error) {
      console.error(error);
      next(error);
   }
}

const handleUserLogout = async (req, res) => {
   const refreshToken = req.cookies?.refreshToken;

   if (refreshToken) {
      await User.updateOne(
         { refreshToken: refreshToken },
         { $unset: { refreshToken: 1 } }
      );
   }

   res.clearCookie("accessToken");
   res.clearCookie("refreshToken");

   return res.status(200).json({ message: "Logged out successfully" });
};

async function handleRefreshAccessToken(req, res) {
   const refreshToken = req.cookies?.refreshToken;

   if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
   }

   try {
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      console.log(mongoose.Types.ObjectId.createFromHexString(user._id));

      const storedUser = await User.findOne({
         _id: mongoose.Types.ObjectId.createFromHexString(user._id),
         refreshToken,
      });

      if (!storedUser) {
         return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = setAccessToken(user);

      res.cookie("accessToken", accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return res.status(200).json({ message: "Access token refreshed successfully" });
   } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
         return res.status(401).json({ message: "Refresh token expired" });
      }
      return res.status(401).json({ message: "Invalid refresh token" });
   }
}

module.exports = {
   handleUserSignup,
   handleUserLogin,
   handleUserLogout,
   handleRefreshAccessToken,
};
