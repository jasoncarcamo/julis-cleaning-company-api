CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users
( first_name, last_name, email, mobile_number, password)
VALUES
( 'Admin', 'admin', 'juliscleaningcompany@gmail.com', '6315263306', '$2a$12$0NFNgwx3HVMr7H1Nx8yGJ.crOOrqWdYSAOMg1WkFNHaBQVPIXVWZe'),
( 'Guest', 'guest', 'guest@guest.com', '9999999999', 'Password1!')