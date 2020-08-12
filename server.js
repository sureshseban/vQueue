const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
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
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

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

app.listen(80, function () {
    console.log('server started - http://127.0.0.1:80/');
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

/**
 * @swagger
 * /getbranchdetail:
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
app.post('/getbranchdetail', function (req, res) {
    const R = 6371e3;
    const cos = Math.cos;
    const pie = Math.PI;
    const UserID = req.body.userID;
    const radius = Number(req.body.radius);
    const lat = Number(req.body.lat)
    const long = Number(req.body.long)

    const MinLatitude = lat - radius / R * 180 / pie;
    const MaxLatitude = lat + radius / R * 180 / pie;
    const MinLongitude = (long - radius / R * 180 / pie) / (cos(lat * pie / 180));
    const MaxLongitude = (long + radius / R * 180 / pie) / (cos(lat * pie / 180));
    connection.query("CALL GetBranchDetail('" + UserID + "', '" + MinLatitude + "', '" + MaxLatitude + "', '" + MinLongitude + "', '" + MaxLongitude + "')", function (error, results, fields) {
        if (error) {
            throw error
        } else {
            res.json(results.length ? results[0] : []);
        }
    })
})