const express = require("express");
const ContactRouter = express.Router();
const transporter = require("../../Services/nodemailer/nodemailer");
const ContactsService = require("./ContactsService");

ContactRouter
    .route("/contact")
    .post((req, res)=>{
        
        let {
            name,
            email,
            mobile_number,
            message
        } = req.body;

        let newMessage = {
            name,
            email,
            mobile_number,
            message
        };

        for( const [key, value] of Object.entries(newMessage)){
            if(value === "" || value === undefined){

                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };
        
        const clientMailOptions = {
            from: "jasoncarcamo30@yahoo.com",
            to: newMessage.email,
            subject: "Thank you for contacting us",
            html: `<main style="text-align: center;">
                <h2>Hello ${newMessage.name}</h2>

                <p>You will recieve a call from our customer representive, thank you!</p>
                <p>Your message to us: ${newMessage.message}</p>
            </main>`
        };

        const adminMailOptions = {
            from: "juliscleaningcompany@gmail.com",
            to: "juliscleaningcompany@gmail.com",
            subject: "Julis Cleaning Company Client",
            html: `<main style="text-align: center;">

                <p>${newMessage.email} has contacted you using your contact form on your website.</p>
                <p><strong>Mobile number:</strong> ${newMessage.mobile_number}</p>
                <p><strong>Message:</strong> ${newMessage.message}</p>
            </main>`
        };

        ContactsService.createContact(req.app.get("db"), newMessage)
            .then( createdContact =>{

                transporter.sendMail( clientMailOptions, ( error, info)=>{
                    if(error){

                        return res.status(400).json({
                            error
                        });
                    };
                    
                    transporter.sendMail( adminMailOptions, ( secondErr, secondInfo)=>{
                        if(secondErr){

                            return res.status(400).json({
                                error: secondErr
                            });
                        };
    
                        return res.status(200).json({
                            sent: secondInfo
                        });    
                    })
                });
            });
    })

module.exports = ContactRouter;