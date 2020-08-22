const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../Helpers/init_mysql')
const {verifyAccessToken} = require('../Helpers/jwt-helper')

router.post('/details', verifyAccessToken, async (req, res, next) => {
    try {
        const R = 6371e3;
        const cos = Math.cos;
        const pie = Math.PI;
        const { userID, radius, lat, long } = req.body

        const minLatitude = lat - radius / R * 180 / pie;
        const maxLatitude = lat + radius / R * 180 / pie;
        const minLongitude = (long - radius / R * 180 / pie) / (cos(lat * pie / 180));
        const maxLongitude = (long + radius / R * 180 / pie) / (cos(lat * pie / 180));
        connection.query("CALL GetBranchDetail('" + userID + "', '" + minLatitude + "', '" + maxLatitude + "', '" + minLongitude + "', '" + maxLongitude + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router