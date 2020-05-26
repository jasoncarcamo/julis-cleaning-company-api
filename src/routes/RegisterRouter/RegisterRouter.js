const express = require("express");
const RegisterRouter = express.Router();
const UserService = require("../../Services/UserService/UserService");
const transporter = require("../../Services/nodemailer/nodemailer");

RegisterRouter
    .route("/register")
    .post((req, res)=>{
        const {
            first_name,
            last_name,
            email,
            mobile_number,
            password
        } = req.body;

        const newUser = {
            first_name,
            last_name,
            email,
            mobile_number,
            password
        };

        for( const [ key, value] of Object.entries(newUser)){
            if(value === undefined){

                return res.status(400).json({
                    error:  `Missing ${key} in body request`
                });
            };
        };

        /*const clientMailOptions = {
            from: "jasoncarcamo30@yahoo.com",
            to: newUser.email,
            subject: "Thank you for contacting us",
            html: `<main style="text-align: center;">
                <h2>Hello ${newMessage.name}</h2>

                <p>You will recieve a call from our customer representive, thank you!</p>
                <p>Your message to us: ${newMessage.message}</p>
            </main>`
        };*/

        const adminMailOptions = {
            from: "juliscleaningcompany@gmail.com",
            to: "juliscleaningcompany@gmail.com",
            subject: "Julis Cleaning Company Client",
            html: `<main style="text-align: center;">

                <p>${newUser.email} has signed up to your website!</p>

                <p><strong>Name:</strong> ${newUser.first_name} ${newUser.last_name}</p>

                <p><strong>Mobile number:</strong> ${newUser.mobile_number}</p>
                <p><strong>Email:</strong> ${newUser.email}</p>
            </main>`
        };

        UserService.getUser( req.app.get("db"), newUser.email)
            .then( dbUser => {

                if(dbUser){

                    return res.status(400).json({
                        error: `User with email: ${newUser.email} already exists`
                    });
                };

                UserService.hashPassword(newUser.password)
                    .then( hashedpassword => {
                        newUser.password = hashedpassword;

                        UserService.createUser( req.app.get("db"), newUser)
                        .then( createdUser => {

                            const subject = newUser.email;
                            const payload = {
                                user: newUser.email
                            };

                            transporter.sendMail( adminMailOptions, ( secondErr, secondInfo)=>{
                                
                                if(secondErr){

                                    return res.status(400).json({
                                        error: secondErr
                                    });
                                };
            
                                return res.status(200).json({
                                    sent: secondInfo,
                                    token: UserService.createToken( subject, payload)
                                });    
                            });
                        });
                    });
            });

    });

module.exports = RegisterRouter;