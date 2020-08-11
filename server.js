var express = require('express');
var app = express();

let mysql = require('mysql');
var bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Virtual Queue',
            description: 'VQ API Documentation',
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
    host: 'weq.csbuoireovxd.ap-south-1.rds.amazonaws.com',
    user: 'weqadmin',
    password: 'weq123admin',
    database: 'weq'
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
 *   Branch:
 *      properties:
 *       userID:
 *         type: number
 *       radius:
 *         type: number
 *       lat:
 *         type: number
 *       long:
 *         type: number
 */

// /**
//  * @swagger
//  * /process_get:
//  *   get:
//  *      tags:
// *           - api
//  *      description: use to get process information
//  *      produces:
//  *          - application/json
//  *      consumes:
//  *          - application/json
//  *      responses:
//  *          '200':
//  *              schema:
//  *                  $ref: '#/definitions/Name'
//  *              description: A succesful response
//  */
app.get('/process_get', function (req, res) {
    response = {
        first_name: 'John',
        last_name: 'Mathews'
    };
    console.log(response);
    res.end(JSON.stringify(response));
})


// /**
//  * @swagger
//  * /process_post:
//  *   post:
//  *     tags:
//  *       - api
//  *     description: returns full name
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: puppy
//  *         description: Name object
//  *         in: body
//  *         required: true
//  *         schema:
//  *           $ref: '#/definitions/Name'
//  *     responses:
//  *       200:
//  *         description: Successfully created
//  */
app.post('/process_post', function (req, res) {
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    console.log(response.first_name + ' ' + response.last_name);
    res.end(JSON.stringify(response.first_name + ' ' + response.last_name));
})

/**
 * @swagger
 * /branchdetails:
 *   post:
 *     tags:
 *       - Branch Details
 *     description: returns all branch details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: branch
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Branch'
 *     responses:
 *       200:
 *         description: Success
 */
app.post('/branchdetails', function (req, res) {
    const R = 6371e3;
    const cos = Math.cos;
    const pie = Math.PI;
    const UserID = req.body.userID;
    const radius = Number(req.body.radius);
    const lat = Number(req.body.lat)
    const long = Number(req.body.long)

    const MinLatitude = lat - radius / R * 180 / pie; // 0.00000000
    const MaxLatitude = lat + radius / R * 180 / pie; // 0.00000000
    const MinLongitude = (long - radius / R * 180 / pie) / (cos(lat * pie / 180)) // 0.00000000
    const MaxLongitude = (long + radius / R * 180 / pie) / (cos(lat * pie / 180)) // 0.00000000
    connection.query("CALL GetBranchDetail('" + UserID + "', '" + MinLatitude + "', '" + MaxLatitude + "', '" + MinLongitude + "', '" + MaxLongitude + "')", function (error, results, fields) {
        if (error) {
            throw error
        } else {
            res.json(results.length ? results[0] : []);
        }
    })
})

app.listen(80, function () {
    console.log('server started - http://127.0.0.1:80/');
})