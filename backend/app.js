import express from 'express'
import { config } from 'dotenv'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import session from 'express-session'
import mongoose from 'mongoose'
import { refresh } from './controller/refreshController.js'
import { logout } from './controller/logoutController.js'
import cors from 'cors'
import { verifyEmail } from './controller/user/userAuthController.js'

config()

mongoose.connect('mongodb://127.0.0.1:27017/Zyrax').then(() => {
    console.log('connected to database')
}).catch((err) => {
    console.log(err)
})

const app = express()

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.json())
app.use('/api/user/', userRoutes)
app.use('/api/admin/', adminRoutes)
app.use('/api/refresh', refresh)
app.get('/api/logout', logout)
app.get('/verify-email',verifyEmail)

app.get('/', (req, res) => {
    console.log(req.session)
    res.send('Server successfully running')
})

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})