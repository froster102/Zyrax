import { Admin } from '../../model/admin.js'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../../utils/utils.js'

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Bad credentials' })
        }
        const admin = await Admin.find({ email: email })
        if (admin) {
            const match = await bcrypt.compare(password, admin.password)
            if (match) {
                const acessToken = generateAccessToken(admin._id, 'admin')
                const refreshToken = generateRefreshToken(admin._id, 'admin')
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
                })
                return res.status(200).json({ acessToken: acessToken })
            } else {
                return res.status(400).json({ message: 'Bad credentials' })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to login an error occured' })
    }
}



export {
    login,
    
    
}