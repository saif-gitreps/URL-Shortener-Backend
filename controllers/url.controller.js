const { nanoid } = require("nanoid");
const URL = require("../models/url.model");

const handleGenerateNewShortUrl = async (req, res) => {
   const shortId = nanoid(8);
   await URL.create({ shortId, redirectURL: req.body.redirectURL });
};
