const express = require("express");
const ContactRouter = express.Router();

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

        for( const [key, value] of Object.entries){
            if(value == undefined){
                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };

        

    })

module.exports = ContactRouter;