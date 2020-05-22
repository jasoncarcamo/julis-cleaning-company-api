const express = require("express");
const BookingsRouter = express.Router();
const BookingsService = require("./BookingsService");
const {requireAuth} = require("../../middleware/jwtAuth");

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
            console.log(value == null)
            console.log(value == "")
            if(value === undefined || value === null || value == ""){
                return res.status(400).json({
                    error: `Missing ${key} in contact info form.`
                })
            }
        };

        newBookings.user_id = req.user.id;

        BookingsService.createBookings(req.app.get("db"), newBookings)
            .then( createdBookings => {

                return res.status(200).json({
                    createdBookings
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