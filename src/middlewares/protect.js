const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) return reject(err);

      return resolve(payload);
    });
  });
};

const protect = async (req, res, next) => {
  // first we need to get the bearer token from the request
  const bearer = req.headers.authorization;

  // we need to check if the bearer token exists and it is valid
  if (!bearer || !bearer.startsWith("Bearer "))
    // if not then we send 401
    return res.status(401).json({
      status: "failed",
      message: "Email or password is not correct",
    });

  //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNThkNDdlN2RmNDIzMjFjZWY1YThjNiIsImlhdCI6MTYxNjQzNDMwMn0.H6tEFiDZSj9wDasJkdYGZh9Jsuzsjb_yx4rSu9tl88I
  // otherwise we need to first pull the token out of the bearer token
  const token = bearer.split("Bearer ")[1].trim();

  // we will verify the token
  let payload;
  try {
    payload = await verifyToken(token);

    // if the verification is not successful then send 401
    if (!payload)
      return res.status(401).json({
        status: "failed",
        message: "Email or password is not correct",

        // if verification is successful then we will get the payload
      });
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Email or password is not correct",
    });
  }

  let user;
  try {
    // from the payload we will get the user
    user = await User.findById(payload.id).lean().exec();

    // if the user is not found then send 401
    if (!user)
      return res.status(401).json({
        status: "failed",
        message: "Email or password is not correct",
      });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: "err.message" });
  }

  // now the user is found so attach the user to the req
  req.user = user;
  next();
};

module.exports = protect;
