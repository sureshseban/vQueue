var express = require('express');
var app = express();

let mysql = require('mysql');
var bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'process get',
            description: 'Process API informtion',
            contact: {
                name: 'Developer'
            },
            servers: ['http://127.0.0.1']
        }
    },
    apis: ['server.js']
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

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

/**
 * @swagger
 * definitions:
 *   Name:
 *     properties:
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 */

/**
 * @swagger
 * /process_get:
 *   get:
 *      tags:
*           - api
 *      description: use to get process information
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      responses:
 *          '200':
 *              schema:
 *                  $ref: '#/definitions/Name'
 *              description: A succesful response
 */
app.get('/process_get', function (req, res) {
    response = {
        first_name: 'John',
        last_name: 'Mathews'
    };
    console.log(response);
    res.end(JSON.stringify(response));
})


/**
 * @swagger
 * /process_post:
 *   post:
 *     tags:
 *       - api
 *     description: returns full name
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: puppy
 *         description: Name object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Name'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/process_post', function (req, res) {
    // console.log(JSON.stringify(req));
    // const R = 6371e3;
    // const sin = Math.sin, cos = Math.cos, acos = Math.acos;
    // const pie = Math.PI;

    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    console.log(response.first_name + ' ' + response.last_name);
    res.end(JSON.stringify(response.first_name + ' ' + response.last_name));
})

app.listen(80, function () {
    console.log('server started - http://127.0.0.1:80/');
})