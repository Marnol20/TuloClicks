const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tuloclicks',
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error('Database Connection Failed:', err);
    return;
  }
  console.log('Connected to MySQL Database');
});

module.exports = db;