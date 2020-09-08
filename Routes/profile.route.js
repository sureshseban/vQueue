const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../Helpers/init_mysql')
const { verifyAccessToken } = require('../Helpers/jwt-helper')

router.post('/details', verifyAccessToken, async (req, res, next) => {
    try {
        const { userID } = req.body
        if (!userID) return next(createError.BadRequest())
        connection.query("CALL GetUserDetail('" + userID + "')", (error, results) => {
            if (error) { return next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(createError.InternalServerError())
    }
})

router.post('/edit', async (req, res, next) => {
    try {
        const { userID, userEmail, dateOfBirth, buildingNumber, streetName, city, state, country, pincode } = req.body
        if (!userID) return next(createError.BadRequest())
        connection.query("CALL UpdateUserDetail('" + userID + "', '" + userEmail + "', '" + dateOfBirth + "', '" + buildingNumber + "','" + streetName + "', '" + city + "', '" + state + "', '" + country + "', '" + pincode + "')", (error, results) => {
            if (error) { return next(createError.InternalServerError()) } else {
                if (error) { return next(createError.InternalServerError()) } else {
                    res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
                }
            }
        })
    } catch (error) {
        next(createError.InternalServerError())
    }
})

module.exports = router