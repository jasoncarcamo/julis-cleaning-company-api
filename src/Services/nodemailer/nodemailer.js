require("dotenv").config();

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "juliscleaningcompany@gmail.com",
        clientSecret: process.env.NODE_MAILER_CLIENT_SECRET,
        clientId: process.env.CLIENT_ID,
        accessToken: process.env.NODE_MAILER_ACCESS_TOKEN,
        refreshToken: process.env.NODE_MAILER_REFRESH_TOKEN
    }
});

module.exports = transporter;
