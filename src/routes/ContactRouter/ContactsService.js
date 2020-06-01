const ContactsService  = {
    getContacts(db){
        return db.select("*").from("contacts");
    },
    createContact(db, newContact){
        return db.insert(newContact).into("contacts").returning("*").then(([createdContact])=> createdContact);
    },
    updateContact(db, updateContact, id){
        return db.update(updateContact).from("contacts").where({id})
    },
    deleteContact(db, id){
        return db.delete().from("contacts").where({id});
    }
};

module.exports = ContactsService;