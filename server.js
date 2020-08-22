const express = require('express')
const createError = require('http-errors')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./Helpers/init_mysql')

const AuthRoute = require('./Routes/auth.route')
const BranchRoute = require('./Routes/branch.route')
const SlotRoute = require('./Routes/slot.route')
const { verifyAccessToken } = require('./Helpers/jwt-helper')

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Virtual Queue',
            description: 'VQ API Documentation',
            contact: {
                name: 'Developer'
            },
            servers: ['http://127.0.0.1']
        }
    },
    apis: ['server.js']
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)

const app = express()

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send('Hellow World')
})

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/auth', AuthRoute)
app.use('/branch', BranchRoute)
app.use('/slot', SlotRoute)

app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message || 'internal server error'
        }
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('app is running')
})
