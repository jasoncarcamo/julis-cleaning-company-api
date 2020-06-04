const express = require("express");
const BookingsRouter = express.Router();
const BookingsService = require("./BookingsService");
const {requireAuth} = require("../../middleware/jwtAuth");
const transporter = require("../../Services/nodemailer/nodemailer");
const ExpoService = require("../ExpoTokenRouter/ExpoService");

BookingsRouter
    .route("/bookings")
    .all(requireAuth)
    .get((req, res)=>{
        BookingsService.getBookings(req.app.get("db"))
            .then( bookings => {

                return res.status(200).json({
                    bookings
                });
            });
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
            message,
            date_created: new Date()
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

                        <p><strong>Set for:</strong> ${new Date(newBookings.date).toDateString()} at ${newBookings.time}</p>

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

                        <p><strong>Message ( Looking to get done):</strong> ${newBookings.message}</p>
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
            message,
            date_created: new Date()
        };

        for(const [key, value] of Object.entries(newBookings)){
            
            if(value === undefined || value === null || value == ""){
                return res.status(400).json({
                    error: `Missing ${key} in contact info form.`
                })
            }
        };

        newBookings.user_id = 1;

        BookingsService.createBookings(req.app.get("db"), newBookings)
            .then( createdBookings => {
                
                /*
                const clientMailOptions = {
                    from: "juliscleaningcompany@gmail.com",
                    to: newBookings.email,
                    subject: "Julis Cleaning Company Quote Request",
                    html: `<main style="text-align: center;">
                        <h2>Hello ${newBookings.name}</h2>
        
                        <p>Thank you for requesting a quote. We have squeezed you into our calender! You will recieve a call from our team member to discuss prices depending on your needs.</p>

                        <p><strong>Set for:</strong> ${new Date(newBookings.date).toDateString()} at ${newBookings.time}</p>

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
        
                        <p>${newBookings.email} has requested a quote as a guest, using your bookings form on your website.</p>

                        <p><strong>Name:</strong> ${newBookings.name}</p>

                        <p><strong>Mobile number:</strong> ${newBookings.mobile_number}</p>

                        <p><strong>Set for:</strong> ${new Date(newBookings.date).toDateString()} at ${newBookings.time}</p>

                        <p><strong>Message ( Looking to get done):</strong> ${newBookings.message}</p>
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

                        const io = req.app.get("io");

                        io.sockets.emit('bookings', createdBookings);
    
                        return res.status(200).json({
                            sent: secondInfo,
                            createdBookings
                        });    
                    });
                });
                */

               ExpoService.getTokens(req.app.get("db"))
               .then( expoTokens => {
                   const io = req.app.get("io");

                   io.sockets.emit('contact', createdContact);

                   return res.status(200).json({
                       expoTokens,
                       createdBookings
                   });
               });
               
            })
    })

BookingsRouter
    .route("/bookings/:id")
    .all(requireAuth)
    .patch((req, res)=>{
        let {
            date,
            time,
            name,
            email,
            mobile_number,
            message,
            viewed,
            confirmed
        } = req.body;

        const updateBook = {
            date,
            time,
            name,
            email,
            mobile_number,
            message,
            viewed,
            confirmed
        };

        for(const [key, value] of Object.entries(updateBook)){
            if(value === undefined || value === ""){
                delete updateBook[key];
            };
        };

        BookingsService.updateBookings(req.app.get("db"), updateBook, req.params.id)
            .then( updatedBook => {
                
                return res.status(200).json({
                    updatedBook
                });
            });
    })
    .delete((req, res)=>{
        BookingsService.deleteBookings(req.app.get("db"), req.params.id)
            .then( deletedBook =>{

                return res.status(200).json({
                    deletedBook
                });
            })
    })

module.exports = BookingsRouter;