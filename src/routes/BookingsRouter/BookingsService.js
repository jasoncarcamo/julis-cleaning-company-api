const BookingsService = {
    getBookings(db){
        return db.select("*").from("bookings");
    },
    getUsersBooking(db, user_id){
        return db.select("*").from("bookings").where({user_id});
    },
    createBookings(db, info){
        return db.insert(info).into("bookings").returning("*").then(([newBookings])=> newBookings);
    },
    updateBookings(db, updateInfo, user_id){
        return db.update(updateInfo).from("bookings").where({user_id});
    },
    deleteBookings(db, id){
        return db.delete().from("bookings").where({id});
    }
};

module.exports = BookingsService;