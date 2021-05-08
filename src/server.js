const express = require("express");

const connect = require("./config/db");
const { signup, signin } = require("./controllers/auth.controller");
const productController = require("./controllers/product.controller");

const app = express();
app.use(express.json());

app.post("/signup", signup);
app.post("/signin", signin);

app.use("/products", productController);

const start = async () => {
  await connect();

  app.listen(2244, function () {
    console.log("Listening on port 2244...");
  });
};

module.exports = start;
