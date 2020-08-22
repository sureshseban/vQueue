const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
                issuer: process.env.ACCESS_TOKEN_ISSUER,
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
            JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
                if (err) return next(createError.Unauthorized())
                req.payload = payload
                next()
            })
        } catch{
            next(createError.InternalServerError())
        }
    }
}