const crypto = require('crypto')

const k1 = crypto.randomBytes(32).toString('hex')

console.log(k1)