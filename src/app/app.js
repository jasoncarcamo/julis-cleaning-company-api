const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const {NODE_ENV} = require("../../config");

const RegiserRouter = require("../routes/RegisterRouter/RegisterRouter");
const LoginRouter = require("../routes/LoginRouter/LoginRouter");
const UserRouter = require("../routes/UserRouter/UserRouter");
const BookingsRouter = require("../routes/BookingsRouter/BookingsRouter");
const ContactRouter = require("../routes/ContactRouter/ContactRouter");
const SubscribeRouter = require("../routes/SubscribeRouter/SubscribeRouter");
const ExpoTokenRouter = require("../routes/ExpoTokenRouter/ExpoTokenRouter");

app.use(morgan((NODE_ENV === "production") ? "tiny" : "common"));
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(helmet());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Routes start here

app.use("/api", RegiserRouter);
app.use("/api", LoginRouter);
app.use("/api", UserRouter);
app.use("/api", BookingsRouter);
app.use("/api", ContactRouter);
app.use("/api", SubscribeRouter);
app.use("/api", ExpoTokenRouter);


app.use(function errorHandler(error, req, res, next) {
    let response;

    if (NODE_ENV === 'production') {
      response = { error: 'Server error' };
    } else {
      console.error(error)
      response = { error: error.message, object: error };
    };

    res.status(500).json(response);
});

module.exports = app;