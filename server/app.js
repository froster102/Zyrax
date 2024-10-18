import express from 'express'
import { config } from 'dotenv'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoutes from './routes/productRoutes.js'
import session from 'express-session'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { refresh } from './controller/refreshController.js'
import connectToDatabase from './config/db.js'

config()

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173','http://192.168.44.189:5173'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/user/', userRoutes)
app.use('/api/v1/admin/', adminRoutes)
app.use('/api/v1/products/', productRoutes)
app.get('/api/v1/auth/refresh', refresh)

app.get('/', (req, res) => {
    res.send('Server successfully running')
})

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, async () => {
    console.log(`Server running on ${process.env.PORT}`)
    await connectToDatabase()
})