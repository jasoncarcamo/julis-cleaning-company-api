const express = require("express");
const SubscribeRouter = express.Router();
const SubcriptionService = require("./SubscribeScervice");

SubscribeRouter
    .route("/subscribe")
    .post((req, res)=>{
        const {
            email
        } = req.body;

        const newSubscription = {
            email
        };

        SubcriptionService.getSubscription(req.app.get("db"), newSubscription.email)
            .then( subscribed => {
                if(subscribed){
                    return res.status(400).json({
                        error: "You are already subscribed."
                    });
                };

                SubcriptionService.createSubscription(req.app.get("db"), newSubscription)
                    .then( subscribed => {
                        return res.status(200).json({
                            subscribed
                        });
                    });
            })
    })

module.exports = SubscribeRouter;