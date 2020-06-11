const ExpoService = {
    getToken( db, token){
        return db.select("*").from("expo_mobile_tokens").where({expo_token: token});
    },
    getTokens(db){
        return db.select("*").from("expo_mobile_tokens")
    },
    createToken(db, newToken){
        return db.insert(newToken).from("expo_mobile_tokens").returning("*").then(([createdToken]) => createdToken);
    },
    updateToken(db, updateToken, id){
        return db.update(updateToken).from("expo_mobile_tokens").where({id});
    },
    deleteToken(db, id){
        return db.delete().from("expo_mobile_tokens").where({id});
    }
};

module.exports = ExpoService;