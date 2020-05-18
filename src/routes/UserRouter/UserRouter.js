const express = require("express");
const UserRouter = express.Router();
const UserService = require("../../Services/UserService/UserService");
const {requireAuth} =require("../../middleware/jwtAuth");

UserRouter
    .route("/user")
    .all(requireAuth)
    .get((req, res)=>{
        UserService.getUser(req.app.get("db"), req.user.email)
            .then( dbUser => {

                delete dbUser['password'];

                return res.status(200).json({
                    user: dbUser
                });
            });
    });

module.exports = UserRouter;