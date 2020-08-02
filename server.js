var express = require('express');
var app = express();

let mysql = require('mysql');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql@123',
    database: 'virtualqueue'
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

app.get('/process_getdata', function (req, res) {
    connection.query('CALL new_procedure', function (error, results, fields) {
        if (error) {
            throw error
        } else {
            res.json(results)
        }
    })
})

// 
app.get('/process_postdata', function (req, res) {
    let obj = { fname: '', lname: '' }
    connection.query('CALL new_procedureFORINSERT', [obj], function (error, results, fields) {
        if (error) {
            throw error
        } else {
            res.json(results)
        }
    })
})

app.get('/process_updatedata', function (req, res) {
    let id = 1;
    connection.query('CALL new_procedureFORUPDATE', [id], function (error, results, fields) {
        if (error) {
            throw error
        } else {
            res.json(results)
        }
    })
})

app.get('/process_get', function (req, res) {
    response = {
        first_name: 'John',
        last_name: 'Mathews'
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.post('/process_post', urlencodedParser, function (req, res) {
    console.log(req);
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

var server = app.listen(80, function () {
    console.log(__dirname);
    console.log('http://127.0.0.1:5000/');
})