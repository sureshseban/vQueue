const mysql = require('mysql')

const connection = mysql.createConnection({
    host: process.env.HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect(err => {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to MySQL server.');
})

module.exports = connection;
