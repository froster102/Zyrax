import express from 'express'
import { config } from 'dotenv'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import session from 'express-session'
import mongoose from 'mongoose'
import cors from 'cors'
import { verifyEmail } from './controller/user/userAuthController.js'
import cookieParser from 'cookie-parser'
import { refresh } from './controller/refreshController.js'
import { logout } from './controller/logoutController.js'

config()

mongoose.connect(process.env.ATLAS_URI).then(() => {
    console.log('connected to database')
}).catch((err) => {
    console.log(err)
})

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'https://1p4tj84j-5173.inc1.devtunnels.ms'],
    credentials: true
}))
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.json())
app.use('/api/v1/users/', userRoutes)
app.use('/api/v1/admin/', adminRoutes)
app.get('/api/v1/auth/refresh', refresh)
app.get('/api/v1/auth/logout', logout)
app.get('/api/v1/verify-email', verifyEmail)

app.get('/', (req, res) => {
    // console.log(req.)
    res.send('Server successfully running')
})

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})