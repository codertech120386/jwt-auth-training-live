const mongoose = require("mongoose");

const connect = async () => {
  return mongoose.connect("mongodb://localhost:27017/live-authentication", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
};

module.exports = connect;
