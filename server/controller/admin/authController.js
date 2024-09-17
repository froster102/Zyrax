import { Admin } from '../../model/admin.js'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../../utils/utils.js'

const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email: email })
        if (admin) {
            const match = await bcrypt.compare(password, admin.password)
            if (match) {
                await Admin.findByIdAndUpdate(admin._id, {
                    lastLogin: Date.now()
                })
                const acessToken = generateAccessToken(admin._id, 'admin')
                const refreshToken = generateRefreshToken(admin._id, 'admin')
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.status(200).json({ accessToken: acessToken, role: 'admin' })
            } else {
                return res.status(401).json({ message: 'Bad credentials' })
            }
        }
        return res.status(401).json({ message: 'Bad credentials' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to login an error occured' })
    }
}

const logout = (req, res) => {
    req.clearCookies('user_jwt', { httpOnly: true, secure: false })
    return res.status(200).json({ message: 'User Logged out successfully' })
}



export {
    signin,
    logout
}