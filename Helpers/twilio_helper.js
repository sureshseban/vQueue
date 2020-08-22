const createError = require('http-errors')

module.exports = {
    sendOTP: (phoneNumber) => {
        return new Promise((resolve, reject) => {
            const client = require('twilio')('', '', {
                lazyLoading: true
            })
            client
                .verify
                .services('')
                .verifications
                .create({
                    to: `+91${phoneNumber}`,
                    channel: 'sms'
                }).then(data => {
                    resolve(data)
                }).catch(err => next(createError.InternalServerError()))
        })
    },
    verifyOTP: (phoneNumber, code) => {
        return new Promise((resolve, reject) => {
            const client = require('twilio')('', '', {
                lazyLoading: true
            })
            client
                .verify
                .services('')
                .verificationChecks
                .create({
                    to: `+91${phoneNumber}`,
                    code: code.toString()
                }).then(data => {
                    resolve(data)
                }).catch(err => next(createError.InternalServerError()))
        })
    }
}
