const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'weq.csbuoireovxd.ap-south-1.rds.amazonaws.com',
    user: 'weqadmin',
    password: 'weq123admin',
    database: 'weq'
})

connection.connect(err => {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to MySQL server.');
})

module.exports = connection;
