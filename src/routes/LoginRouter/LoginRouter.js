const express = require("express");
const LoginRouter = express.Router();
const UserService = require("../../Services/UserService/UserService");

LoginRouter
    .route("/login")
    .post((req, res)=>{
        const {
            email,
            password
        } = req.body;

        const user = {
            email,
            password
        };

        for( const [key, value] of Object.entries(user)){
            if(value === undefined){

                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };

        UserService.getUser( req.app.get("db"), user.email)
            .then( dbUser => {
                if(!dbUser){

                    return res.status(404).json({
                        error: `User with email: ${user.email} does not exist`
                    });
                };

                UserService.comparePassword( user.password, dbUser.password)
                    .then( passwordMatches => {
                        if(!passwordMatches){

                            return res.status(400).json({
                                error: "Incorrect password"
                            });
                        };

                        const subject = dbUser.email;
                        const payload = {
                            user: user.email
                        };

                        return res.status(200).json({
                            token: UserService.createToken( subject, payload)
                        });
                    });
            });

    });

module.exports = LoginRouter;