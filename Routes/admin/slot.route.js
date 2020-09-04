const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../../Helpers/init_mysql')

router.post('/details', async (req, res, next) => {
    try {
        const { userID, branchID, startDate, endDate } = req.body
        connection.query("CALL GetAdminSlotDetail('" + userID + "', '" + branchID + "', '" + startDate + "', '" + endDate + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ booked: results.length ? results[0] : [], freeSlots: results.length > 1 ? results[1] : [], config: results.length > 2 ? results[2] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router