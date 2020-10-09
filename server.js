const express = require('express')
var cors = require('cors')
const createError = require('http-errors')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const bodyParser = require('body-parser')
const path = require("path")
require('./Helpers/init_mysql')

const AuthRoute = require('./Routes/auth.route')
const BranchRoute = require('./Routes/branch.route')
const SlotRoute = require('./Routes/slot.route')
const BookingRoute = require('./Routes/booking.route')
const ProfileRoute = require('./Routes/profile.route')

const { verifyAccessToken } = require('./Helpers/jwt-helper')

const AdminSlotRoute = require('./Routes/admin/slot.route')

// Super Admin
const SuperAdminAuthRoute = require('./Routes/super-admin/auth.route')
const SuperAdminBranchRoute = require('./Routes/super-admin/branch.route')

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

// app.get('/', verifyAccessToken, async (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.send('Hellow World')
// })

// app.get("/", (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.sendFile(path.join(__dirname, "build", "index.html"));
// })

app.use(express.static("build"))

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/auth', AuthRoute)
app.use('/branch', BranchRoute)
app.use('/slot', SlotRoute)
app.use('/booking', BookingRoute)
app.use('/profile', ProfileRoute)

app.use('/admin/slot', AdminSlotRoute)
app.use('/superadmin/auth', SuperAdminAuthRoute)
app.use('/superadmin/branch', SuperAdminBranchRoute)

app.get('*',(req,res) =>{
    res.sendFile(path.join(__dirname,'build/index.html'));
});

app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status || 500,
            message: err.message || 'internal server error'
        }
    })
})

app.listen(80, () => {
    console.log('app is running')
})
