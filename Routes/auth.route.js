const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../Helpers/init_mysql')
const { signAccessToken } = require('../Helpers/jwt-helper')
const { sendOTP, verifyOTP } = require('../Helpers/twilio_helper')

router.post('/register', async (req, res, next) => {
    try {
        const { firstName, lastName, userEmail, phoneNumber } = req.body
        if (!firstName || !lastName || !phoneNumber) return next(createError.BadRequest())
        connection.query("CALL RegisterUser('" + firstName + "', '" + lastName + "', '" + userEmail + "', '" + phoneNumber + "' )", (error, results) => {
            if (error) { return next(createError.InternalServerError()) } else {
                signAccessToken(phoneNumber).then((accessToken) => {
                    res.json({ accessToken: accessToken, userID: results[0][0].UserID, userName: results[0][0].UserName, roleID: results[0][0].RoleID })
                })
            }
        })
    } catch (error) {
        next(createError.InternalServerError())
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { phoneNumber } = req.body
        if (!phoneNumber) return next(createError.BadRequest())
        connection.query("CALL GetPhoneNumberStatus( '" + phoneNumber + "')", (error, results) => {
            if (error) { return next(createError.InternalServerError()) } else {
                const isExists = results[0][0].IsExist
                const userID = results[0][0].UserID
                const userName = results[0][0].UserName
                const roleID = results[0][0].RoleID
                sendOTP(phoneNumber).then(message => {
                    message.isExists = isExists
                    message.userID = userID
                    message.userName = userName
                    message.roleID = roleID
                    res.json({ otp: message })
                })
            }
        })
    } catch (error) {
        next(createError.InternalServerError())
    }
})

router.post('/verify', async (req, res, next) => {
    try {
        const { phoneNumber, code, isExists } = req.body
        if (!phoneNumber || !code) return next(createError.BadRequest())
        verifyOTP(phoneNumber, code).then(message => {
            if (message.status === 'approved') {
                if (isExists) {
                    signAccessToken(phoneNumber).then((accessToken) => {
                        res.json({ accessToken: accessToken })
                    })
                } else {
                    message.isExists = 0
                    res.json(message)
                }
            } else {
                next(createError.InternalServerError())
            }
        })
    } catch (error) {
        next(createError.InternalServerError())
    }
})

module.exports = router