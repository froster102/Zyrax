import express from 'express'
import { config } from 'dotenv'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import session from 'express-session'
import mongoose from 'mongoose'
config()

mongoose.connect('mongodb://127.0.0.1:27017/Zyrax').then(() => {
    console.log('connected to database')
}).catch((err) => {
    console.log(err)
})

const app = express()

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use('/api/user/', userRoutes)
app.use('/api/admin/', adminRoutes)

app.get('/', (req, res) => {
    console.log(req.session)
    res.send('Server successfully running')
})

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})