const ContactsService  = {
    getContacts(db){
        return db.select("*").from("contacts");
    },
    createContact(db, newContact){
        return db.insert(newContact).into("contacts").returning("*").then(([createdContact])=> createdContact);
    },
    deleteContact(db, id){
        return db.delete().from("contacts").where({id});
    }
};

module.exports = ContactsService;