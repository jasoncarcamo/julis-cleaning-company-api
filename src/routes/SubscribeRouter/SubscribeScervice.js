const SubscribeService = {
    getSubscription(db, email){
        return db.select("*").from("subscriptions").where({email}).first();
    },
    createSubscription(db, newSubscription){

        return db.insert(newSubscription).into("subscriptions").returning("*").then(([createdSubscription]) => createdSubscription);
    },
    deleteSubscription(db, email){
        return db.select("*").from("subscriptions").where({ email});
    }
};

module.exports = SubscribeService;