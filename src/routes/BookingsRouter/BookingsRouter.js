const express = require("express");
const BookingsRouter = express.Router();
const BookingsService = require("./BookingsService");
const {requireAuth} = require("../../middleware/jwtAuth");
const transporter = require("../../Services/nodemailer/nodemailer");

BookingsRouter
    .route("/bookings")
    .all(requireAuth)
    .get((req, res)=>{
        BookingsService.getUsersBooking(req.app.get("db"), req.user.id)
            .then( bookings => {

                return res.status(200).json({
                    bookings
                });
            })
    })
    .post((req, res)=>{
        let {
            date,
            time,
            name,
            email,
            mobile_number,
            message
        } = req.body;

        const newBookings = {
            date,
            time,
            name,
            email,
            mobile_number,
            message
        };

        for(const [key, value] of Object.entries(newBookings)){
            
            if(value === undefined || value === null || value == ""){
                return res.status(400).json({
                    error: `Missing ${key} in contact info form.`
                })
            }
        };

        newBookings.user_id = req.user.id;

        BookingsService.createBookings(req.app.get("db"), newBookings)
            .then( createdBookings => {

                const clientMailOptions = {
                    from: "juliscleaningcompany@gmail.com",
                    to: newBookings.email,
                    subject: "Julis Cleaning Company Quote Request",
                    html: `<main style="text-align: center;">
                        <h2>Hello ${req.user.first_name} ${req.user.last_name}</h2>
        
                        <p>Thank you for requesting a quote. We have squeezed you into our calender! You will recieve a call from our team member to discuss prices depending on your needs.</p>

                        <p><strong>Mobile number:</strong> ${newBookings.mobile_number}</p>

                        <p><strong>Email:</strong> ${newBookings.email}</p>

                        <p><strong>Your message to us:</strong> ${newBookings.message}</p>
                    </main>`
                };
        
                const adminMailOptions = {
                    from: "juliscleaningcompany@gmail.com",
                    to: "juliscleaningcompany@gmail.com",
                    subject: "Julis Cleaning Company Client",
                    html: `<main style="text-align: center;">
        
                        <p>${newBookings.email} has requested a quote using your bookings form on your website.</p>

                        <p><strong>Name:</strong> ${req.user.first_name} ${req.user.last_name}</p>

                        <p><strong>Mobile number:</strong> ${newBookings.mobile_number}</p>

                        <p><strong>Set for:</strong> ${new Date(newBookings.date).toDateString()} at ${newBookings.time}</p>

                        <p><strong>Message:</strong> ${newBookings.message}</p>
                    </main>`
                };

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
                            sent: secondInfo,
                            createdBookings
                        });    
                    })
                });

            })
    })

BookingsRouter
    .route("/bookings/guest")
    .post((req, res)=>{
        let {
            date,
            time,
            name,
            email,
            mobile_number,
            message
        } = req.body;

        const newBookings = {
            date,
            time,
            name,
            email,
            mobile_number,
            message
        };

        for(const [key, value] of Object.entries(newBookings)){
            
            if(value === undefined || value === null || value == ""){
                return res.status(400).json({
                    error: `Missing ${key} in contact info form.`
                })
            }
        };

        newBookings.user_id = 0;

        BookingsService.createBookings(req.app.get("db"), newBookings)
            .then( createdBookings => {

                const clientMailOptions = {
                    from: "juliscleaningcompany@gmail.com",
                    to: newBookings.email,
                    subject: "Julis Cleaning Company Quote Request",
                    html: `<main style="text-align: center;">
                        <h2>Hello ${newBookings.first_name} ${newBookings.last_name}</h2>
        
                        <p>Thank you for requesting a quote. We have squeezed you into our calender! You will recieve a call from our team member to discuss prices depending on your needs.</p>

                        <p><strong>Mobile number:</strong> ${newBookings.mobile_number}</p>

                        <p><strong>Email:</strong> ${newBookings.email}</p>

                        <p><strong>Your message to us:</strong> ${newBookings.message}</p>
                    </main>`
                };
        
                const adminMailOptions = {
                    from: "juliscleaningcompany@gmail.com",
                    to: "juliscleaningcompany@gmail.com",
                    subject: "Julis Cleaning Company Client",
                    html: `<main style="text-align: center;">
        
                        <p>${newBookings.email} has requested a quote using your bookings form on your website.</p>

                        <p><strong>Name:</strong> ${newBookings.first_name} ${newBookings.last_name}</p>

                        <p><strong>Mobile number:</strong> ${newBookings.mobile_number}</p>

                        <p><strong>Set for:</strong> ${new Date(newBookings.date).toDateString()} at ${newBookings.time}</p>

                        <p><strong>Message:</strong> ${newBookings.message}</p>
                    </main>`
                };

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
                            sent: secondInfo,
                            createdBookings
                        });    
                    });
                });
            })
    })

BookingsRouter
    .route("/bookings/:id")
    .all(requireAuth)
    .delete((req, res)=>{
        BookingsService.deleteBookings(req.app.get("db"), req.params.id)
            .then( deletedBook =>{

                return res.status(200).json({
                    deletedBook
                });
            })
    })

module.exports = BookingsRouter;