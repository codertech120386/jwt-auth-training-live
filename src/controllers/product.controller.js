const express = require("express");
const router = express.Router();

const protect = require("../middlewares/protect");
const Product = require("../models/product.model");

router.get("/", protect, async function (req, res) {
  const products = await Product.find({}).lean().exec();

  res.status(200).json({ status: "success", products });
});

module.exports = router;
