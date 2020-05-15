const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../../../config");

const AuthService = {
    getUser(db, email){
        return db.select("*").from("users").where({ email }).first();
    },
    verifyJwt(token){
        return jwt.verify(
            token,
            JWT_SECRET, {
                algorithms: ["HS256"]
            }
        );
    }
};

module.exports = AuthService;