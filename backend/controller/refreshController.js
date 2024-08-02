import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../utils/utils.js'


const userRefresh = (req, res) => {
    const refreshToken = req.cookies?.user_jwt
    console.log('user refresh ' + refreshToken)
    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorised no token' })
    }
    jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json(403).json({ message: 'Forbidden token expired' })
        }
        const accessToken = generateAccessToken(decoded.userId, decoded.role)
        return res.status(200).json({ message: 'accessToken', role: 'user' })
    })
}

const adminRefresh = (req, res) => {
    const refreshToken = req.cookies?.admin_jwt
    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorised no token' })
    }
    jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden token expired' })
        }
        const accessToken = generateAccessToken(decoded.userId, decoded.role)
        return res.status(200).json({ accessToken: accessToken, role: 'admin' })
    })
}

export { userRefresh, adminRefresh }