const express = require("express");
const ExpoTokenRouter = express.Router();
const ExpoService = require("./ExpoService");

ExpoTokenRouter
    .route("/expo")
    .get((req, res)=>{
        ExpoService.getTokens(req.app.get("db"))
            .then( expoTokens => {

                return res.status(200).json({
                    expoTokens
                });

            });
    })
    .post((req, res)=> {
        const {
            expo_token
        } = req.body;

        const newToken = {
            expo_token
        };

        if(newToken.expo_token === undefined || newToken.expo_token === ""){
            return res.status(400).json({
                error: "Missing expo_token in body request"
            });
        };

        ExpoService.createToken(req.app.get("db"), newToken)
            .then( createdToken => {
                return res.status(200).json({
                    createdToken
                })
            })

    })

ExpoTokenRouter
    .route("/expo/:token")
    .get((req, res)=>{
        
        ExpoService.getToken(req.app.get("db"), req.params.token)
            .then( token => {
                if(!token){
                    return res.status(404).json({
                        error: "Token was not found"
                    })
                };
                
                return res.status(200).json({
                    token
                });
            })
    })

module.exports = ExpoTokenRouter;