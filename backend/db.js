const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Default for XAMPP is empty
    database: "tuloclicks" // <--- Update this to your actual DB name
});

db.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

module.exports = db;