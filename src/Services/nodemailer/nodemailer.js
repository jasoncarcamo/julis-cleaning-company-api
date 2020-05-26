require("dotenv").config();

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "juliscleaningcompany@gmail.com",
        pass: process.env.NODE_MAILER_PASS
    }
});

module.exports = transporter;
