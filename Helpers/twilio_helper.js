const createError = require('http-errors')
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})

module.exports = {
    sendOTP: (phoneNumber) => {
        return new Promise((resolve, reject) => {
            client
                .verify
                .services(process.env.TWILIO_SERVICE_ID)
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
            client
                .verify
                .services(process.env.TWILIO_SERVICE_ID)
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
