import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../utils/utils.js'
import { User } from '../model/user.js'

const refresh = (req, res) => {
    const refreshToken = req.cookies?.jwt
    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorised no token' })
    }
    jwt.verify(refreshToken, process.env.SECRET, async (err, decoded) => {
        try {
            const user = await User.findOne({ _id: decoded?.userId })
            if (user?.status === 'blocked') {
                return res.status(401).json({ message: 'Account has been blocked' })
            }
        } catch (error) {
            console.log(error)
        }
        if (err) {
            return res.status(403).json({ message: 'Forbidden token expired' })
        }
        const accessToken = generateAccessToken(decoded.userId, decoded.role)
        return res.status(200).json({ accessToken, role: decoded.role })
    })

}



export { refresh }