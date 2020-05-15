const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const {NODE_ENV} = require("../../config");

const RegiserRouter = require("../routes/RegisterRouter/RegisterRouter");
const LoginRouter = require("../routes/LoginRouter/LoginRouter");
const UserRouter = require("../routes/UserRouter/UserRouter");

app.use(morgan((NODE_ENV === "production") ? "tiny" : "common"));
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(helmet());

//Routes start here

app.use("/api", RegiserRouter);
app.use("/api", LoginRouter);
app.use("/api", UserRouter);

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