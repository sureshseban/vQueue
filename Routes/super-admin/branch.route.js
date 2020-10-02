const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../../Helpers/init_mysql')

router.post('/getallbranches', async (req, res, next) => {
    try {
        const { UserID, ClientID } = req.body
        connection.query("CALL GetAdminBranchDetail('" + UserID + "', '" + ClientID + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/getallcategories', async (req, res, next) => {
    try {
        const { UserID } = req.body
        connection.query("CALL GetCategoryDetail('" + UserID + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                res.json({ data: results.length ? results[0] : [], config: results.length > 1 ? results[1] : {} })
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router