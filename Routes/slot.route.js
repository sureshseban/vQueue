const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../Helpers/init_mysql')
const { verifyAccessToken } = require('../Helpers/jwt-helper')

router.post('/details', verifyAccessToken, async (req, res, next) => {
    try {
        const { userID, branchID, startDate, endDate } = req.body
        connection.query("CALL GetSlotDetail('" + userID + "', '" + branchID + "', '" + startDate + "', '" + endDate + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/book', verifyAccessToken, async (req, res, next) => {
    try {
        const { userID, branchID, bookingDate, maximumBookingCount, slotStartTime, slotEndTime } = req.body
        connection.query("CALL BookMySlot('" + userID + "', '" + branchID + "', '" + bookingDate + "', '" + maximumBookingCount + "', '" + slotStartTime + "', '" + slotEndTime + "')", (error, results) => {
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
        const { userID, branchID, bookingID, bookingUniqueID, bookingDate, maximumBookingCount, slotStartTime, slotEndTime } = req.body
        connection.query("CALL EditMySlot('" + userID + "', '" + branchID + "', '" + bookingID + "', '" + bookingUniqueID + "','" + bookingDate + "', '" + maximumBookingCount + "', '" + slotStartTime + "', '" + slotEndTime + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/cancel', verifyAccessToken, async (req, res, next) => {
    try {
        const { userID, branchID, bookingID, bookingUniqueID } = req.body
        connection.query("CALL CancelMySlot('" + userID + "', '" + branchID + "', '" + bookingID + "', '" + bookingUniqueID + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json(results)
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router