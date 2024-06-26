const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    //credentials dùng để thao tác cookie trên trình duyệt, (nhớ set withCredentials bên folder api user.js)
    credentials: true
}))
app.use(cookieParser())
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

dbConnect()
initRoutes(app)

app.use('/', (req, res) => { res.send('SERVER ONNNNN') })

app.listen(port, () => {
    console.log('Server running on the port: ' + port);
})