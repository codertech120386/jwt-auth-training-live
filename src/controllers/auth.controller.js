require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
};

const signup = async (req, res) => {
  try {
    // create an user
    const user = await User.create(req.body);
    // create a token for the user
    const token = newToken(user);
    console.log("token", token);
    res.status(201).json({ status: "success", token });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};

const signin = async (req, res) => {
  // first we will try to fetch the user from the email provided
  let user;
  try {
    user = await User.findOne({ email: req.body.email }).exec();

    // if user is not found then error
    if (!user)
      return res.status(401).json({
        status: "failed",
        message: "Email or password is not correct",
      });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
  try {
    // if user is found then we need to check if passwords match
    const match = await user.checkPassword(req.body.password);

    // else we will send the error
    if (!match)
      return res.status(401).json({
        status: "failed",
        message: "Email or password is not correct",
      });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }

  // if password is matched then send the token
  const token = newToken(user);
  return res.status(201).json({ status: "success", token });
};

module.exports = { signup, signin };
