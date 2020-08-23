const createError = require('http-errors')
const connection = require('./init_mysql')

module.exports = {
    sendOTP: (phoneNumber) => {
        return new Promise((resolve, reject) => {
            const key = 'twilio'
            connection.query("CALL GetConfigurationDetail('" + key + "')", (error, results) => {
                const _twilio = JSON.parse(results[0][0].ConfigurationValue)
                if (error) { next(createError.InternalServerError()) } else {
                    const client = require('twilio')(_twilio.ACCOUNT_SID, _twilio.AUTH_TOKEN, {
                        lazyLoading: true
                    })
                    client
                        .verify
                        .services(_twilio.SERVICE_ID)
                        .verifications
                        .create({
                            to: `+91${phoneNumber}`,
                            channel: 'sms'
                        }).then(data => {
                            resolve(data)
                        }).catch(err => next(createError.InternalServerError()))
                }
            })
        })
    },
    verifyOTP: (phoneNumber, code) => {
        return new Promise((resolve, reject) => {
            const key = 'twilio'
            connection.query("CALL GetConfigurationDetail('" + key + "')", (error, results) => {
                const _twilio = JSON.parse(results[0][0].ConfigurationValue)
                if (error) { next(createError.InternalServerError()) } else {
                    const client = require('twilio')(_twilio.ACCOUNT_SID, _twilio.AUTH_TOKEN, {
                        lazyLoading: true
                    })
                    client
                        .verify
                        .services(_twilio.SERVICE_ID)
                        .verificationChecks
                        .create({
                            to: `+91${phoneNumber}`,
                            code: code.toString()
                        }).then(data => {
                            resolve(data)
                        }).catch(err => next(createError.InternalServerError()))
                }
            })
        })
    }
}
