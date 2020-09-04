const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../../Helpers/init_mysql')

router.post('/details', async (req, res, next) => {
    try {
        const { userID, branchID, startDate, endDate } = req.body
        connection.query("CALL GetAdminSlotDetail('" + userID + "', '" + branchID + "', '" + startDate + "', '" + endDate + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/test', async (req, res, next) => {
    res.json("hello world")
})

module.exports = router