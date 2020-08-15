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
 *   Slot:
 *      properties:
 *       userID:
 *         type: number
 *       branchID:
 *         type: number
 *       startDate:
 *         type: string
 *       endDate:
 *         type: string
 *   BookMySlot:
 *      properties:
 *       userID:
 *         type: number
 *       branchID:
 *         type: number
 *       bookingDate:
 *         type: string
 *       maximumBookingCount:
 *         type: number
 *       slotStartTime:
 *         type: string
 *       slotEndTime:
 *         type: string
 *   EditMySlot:
 *      properties:
 *       userID:
 *         type: number
 *       branchID:
 *         type: number
 *       bookingID:
 *         type: number
 *       bookingUniqueID:
 *         type: number
 *       bookingDate:
 *         type: string
 *       maximumBookingCount:
 *         type: number
 *       SlotStartTime:
 *         type: string
 *       SlotEndTime:
 *         type: string
 *   CancelMySlot:
 *      properties:
 *       userID:
 *         type: number
 *       branchID:
 *         type: number
 *       bookingID:
 *         type: number
 *       bookingUniqueID:
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
    const userID = req.body.userID;
    const radius = Number(req.body.radius);
    const lat = Number(req.body.lat)
    const long = Number(req.body.long)

    const minLatitude = lat - radius / R * 180 / pie;
    const maxLatitude = lat + radius / R * 180 / pie;
    const minLongitude = (long - radius / R * 180 / pie) / (cos(lat * pie / 180));
    const maxLongitude = (long + radius / R * 180 / pie) / (cos(lat * pie / 180));
    connection.query("CALL GetBranchDetail('" + userID + "', '" + minLatitude + "', '" + maxLatitude + "', '" + minLongitude + "', '" + maxLongitude + "')", function (error, results) {
        if (error) {
            throw error
        } else {
            res.json({
                data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {}
            });
        }
    })
})

/**
 * @swagger
 * /getslotdetail:
 *   post:
 *     tags:
 *       - Slot Details
 *     description: returns all slot details of a branch
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slot
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Slot'
 *     responses:
 *       200:
 *         description: Success
 */
app.post('/getslotdetail', function (req, res) {
    connection.query("CALL GetSlotDetail('" + req.body.userID + "', '" + req.body.branchID + "', '" + req.body.startDate + "', '" + req.body.endDate + "')", function (error, results) {
        if (error) {
            throw error
        } else {
            res.json({
                data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {}
            });
        }
    })
})

/**
 * @swagger
 * /bookmyslot:
 *   post:
 *     tags:
 *       - Book a Slot
 *     description: book one or more slots
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bookmyslot
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/BookMySlot'
 *     responses:
 *       200:
 *         description: Success
 */
app.post('/bookmyslot', function (req, res) {
    connection.query("CALL BookMySlot('" + req.body.userID + "', '" + req.body.branchID + "', '" + req.body.bookingDate + "', '" + req.body.maximumBookingCount + "', '" + req.body.slotStartTime + "', '" + req.body.slotEndTime + "')", function (error, results) {
        if (error) {
            throw error
        } else {
            res.json({
                data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {}
            });
        }
    })
})

/**
 * @swagger
 * /editmyslot:
 *   post:
 *     tags:
 *       - Edit a Slot
 *     description: edit a slot
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: editmyslot
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/EditMySlot'
 *     responses:
 *       200:
 *         description: Success
 */
app.post('/editmyslot', function (req, res) {
    connection.query("CALL EditMySlot('" + req.body.userID + "', '" + req.body.branchID + "', '" + req.body.bookingID + "', '" + req.body.bookingUniqueID + "','" + req.body.bookingDate + "', '" + req.body.maximumBookingCount + "', '" + req.body.slotStartTime + "', '" + req.body.slotEndTime + "')", function (error, results) {
        if (error) {
            throw error
        } else {
            res.json({
                data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {}
            });
        }
    })
})

/**
 * @swagger
 * /cancelmyslot:
 *   post:
 *     tags:
 *       - Cancel a Slot
 *     description: cancel a slot
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cancelmyslot
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CancelMySlot'
 *     responses:
 *       200:
 *         description: Success
 */
app.post('/cancelmyslot', function (req, res) {
    connection.query("CALL CancelMySlot('" + req.body.userID + "', '" + req.body.branchID + "', '" + req.body.bookingID + "', '" + req.body.bookingUniqueID + "')", function (error, results) {
        if (error) {
            throw error
        } else {
            res.json(results);
        }
    })
})