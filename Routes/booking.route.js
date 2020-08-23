const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../Helpers/init_mysql')
const { verifyAccessToken } = require('../Helpers/jwt-helper')

router.post('/history', verifyAccessToken, async (req, res, next) => {
    try {
        const { userID } = req.body
        connection.query("CALL GetBookingHistory('" + userID + "', " + null + ", " + null + ")", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/edit', verifyAccessToken, async (req, res, next) => {
    try {
        const { userID, bookingID, bookingUniqueID, branchID, startDate, endDate } = req.body
        connection.query("CALL GetBookingEditDetail('" + userID + "', '" + bookingID + "', '" + bookingUniqueID + "','" + branchID + "', '" + startDate + "', '" + endDate + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.send({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router