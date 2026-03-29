const mysql = require('mysql2')

const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '',
  database: 'tuloclicks',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err)
  } else {
    console.log('Connected to MySQL database')
    connection.release()
  }
})

module.exports = db