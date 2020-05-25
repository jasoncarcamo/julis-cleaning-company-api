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
        
        console.log(newMessage)

        for( const [key, value] of Object.entries(newMessage)){
            if(value === "" || value === undefined){
                console.log(key)
                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };

        console.log(req.headers)

        if(req.method === "OPTIONS"){
            return;
        }

        
        const mailOptions = {
            from: "jasoncarcamo30@yahoo.com",
            to: newMessage.email,
            subject: "Thank you for contacting us",
            html: `<main style="text-align: center;">
                <h2>Hello ${newMessage.name}</h2>

                <p>You will recieve a call from our customer representive, thank you!</p>
                <p>Your message to us: ${newMessage.message}</p>
            </main>`
        };

        ContactsService.createContact(req.app.get("db"), newMessage)
            .then( createdContact =>{

                transporter.sendMail( mailOptions, ( error, info)=>{
                    if(error){
                        console.log(error)
                    };
        
                    if(info){
                        console.log(info)
                        
                        return res.status(200).json({
                            createContact
                        });
                    };
        
                });
            })

    })

module.exports = ContactRouter;