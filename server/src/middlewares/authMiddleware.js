import jwt from 'jsonwebtoken'
import { User } from '../model/user.js'

const userAuth = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization
    const userToken = authHeader?.split(' ')[1]
    if (!userToken) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    jwt.verify(userToken, process.env.SECRET, async (err, decoded) => {
        try {
            const user = await User.findOne({ _id: decoded?.userId })
            if (user?.status === 'blocked') {
                return res.status(401).json({ message: 'Account has been blocked' })
            }
        } catch (error) {
        }
        if (err) {
            return res.status(403).json({ message: 'Forbidden token expired' })
        } else if (decoded.role !== 'user') {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        req.userId = decoded?.userId
        req.role = decoded?.role
        next()
    })
}

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization
    const adminToken = authHeader?.split(' ')[1]
    if (!adminToken) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    jwt.verify(adminToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden token expired' })
        } else if (decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        req.userId = decoded.userId
        req.role = decoded?.role
        next()
    })
}

export {
    userAuth,
    adminAuth
}