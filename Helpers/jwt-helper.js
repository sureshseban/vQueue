const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = '5a6093ab9797fe1bcaab93b0a32e0754f0ef12f562633535c8438caba11d4070'
            const options = {
                expiresIn: '365d',
                issuer: 'http://ec2-52-15-191-227.us-east-2.compute.amazonaws.com/',
                audience: userId.toString() + Date.parse(new Date()).toString()
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        try {
            if (!req.headers['authorization']) return next(createError.Unauthorized())
            const authHeader = req.headers['authorization']
            const bearerToken = authHeader.split(' ')
            const token = bearerToken[1]
            const secret = '5a6093ab9797fe1bcaab93b0a32e0754f0ef12f562633535c8438caba11d4070'
            JWT.verify(token, secret, (err, payload) => {
                if (err) return next(createError.Unauthorized())
                req.payload = payload
                next()
            })
        } catch{
            next(createError.InternalServerError())
        }
    }
}