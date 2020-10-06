const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const connection = require('../../Helpers/init_mysql')
const { sendOTP, verifyOTP } = require('../../Helpers/twilio_helper')

router.post('/register', async (req, res, next) => {
    try {
        const { ClientName, FirstName, LastName, UserEmail, PhoneNumber } = req.body
        connection.query("CALL RegisterSuperAdmin('" + ClientName + "', '" + FirstName + "', '" + LastName + "', '" + UserEmail + "', '" + PhoneNumber + "')", (error, results) => {
            if (error) { next(createError.InternalServerError()) } else {
                if (results[0][0].IsExist) {
                    res.json({ IsExist: 1 })
                } else {
                    const Name = results[0][0].UserName
                    const UserID = results[0][0].UserID
                    const RoleID = results[0][0].RoleID
                    const ClientID = results[0][0].ClientID
                    const ClientName = results[0][0].ClientName
                    sendOTP(PhoneNumber).then(message => {
                        message.UserID = UserID
                        message.Name = Name
                        message.RoleID = RoleID
                        message.ClientID = ClientID
                        message.ClientName = ClientName
                        res.json({ otp: message, IsExist: 0 })
                    })
                }
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { PhoneNumber } = req.body
        if (!PhoneNumber) return next(createError.BadRequest())
        connection.query("CALL GetAdminPhoneNumberStatus( '" + PhoneNumber + "')", (error, results) => {
            if (error) { return next(createError.InternalServerError()) } else {
                if (!results[0][0].IsExist) {
                    res.json({ IsExist: 0 })
                } else {
                    const Name = results[0][0].UserName
                    const UserID = results[0][0].UserID
                    const RoleID = results[0][0].RoleID
                    const ClientID = results[0][0].ClientID
                    const ClientName = results[0][0].ClientName
                    sendOTP(PhoneNumber).then(message => {
                        message.UserID = UserID
                        message.Name = Name
                        message.RoleID = RoleID
                        message.ClientID = ClientID
                        message.ClientName = ClientName
                        res.json({ otp: message, IsExist: 1 })
                    })
                }
            }
        })
    } catch (error) {
        next(createError.InternalServerError())
    }
})

router.post('/verify', async (req, res, next) => {
    try {
        const { PhoneNumber, code } = req.body
        if (!PhoneNumber || !code) return next(createError.BadRequest())
        verifyOTP(PhoneNumber, code).then(message => {
            if (message.status === 'approved') {
                res.json(message)
                // if (isExists) {
                //     signAccessToken(phoneNumber).then((accessToken) => {
                //         res.json({ accessToken: accessToken })
                //     })
                // } else {
                //     message.isExists = 0
                //     res.json(message)
                // }
            } else {
                next(createError.InternalServerError())
            }
        })
    } catch (error) {
        next(createError.InternalServerError())
    }
})

module.exports = router