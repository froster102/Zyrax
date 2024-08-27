import { User } from "../../model/user.js"
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken, sendVerifyEmail } from '../../utils/utils.js'
import jwt from 'jsonwebtoken'

const googleSigninCallback = async (req, res) => {
    const user = await User.findOne({ googleId: req.user.id })
    if (user.status === 'blocked') {
        return res.send(`
            <script>
                window.onload = () => {
                if (window.opener) {
                     window.opener.postMessage({ error:'Failed to login user account has been blocked'}, 'http://localhost:5173');
                    }
                window.close();
                };
            </script>`)
    }
    const accessToken = generateAccessToken(user._id, 'user')
    const refreshToken = generateRefreshToken(user._id, 'user')
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: 'localhost'
    })
    res.send(`
        <script>
            window.onload = () => {
            const token = '${accessToken}';
            if (window.opener) {
                 window.opener.postMessage({ accessToken: token , role : 'user'  }, 'http://localhost:5173');
                }
            window.close();
            };
        </script>`)
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (user) {
            if (user.status === 'blocked') {
                return res.status(401).json({ message: 'User account blocked' })
            }
            const match = await bcrypt.compare(password, user.password)
            if (!user.verification_status) {
                return res.status(400).json({ message: 'Please verify your account by clicking the link send to your email' })
            }
            if (match && user.verification_status) {
                const token = generateAccessToken(user._id, 'user')
                const refreshToken = generateRefreshToken(user._id, 'user')
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.status(200).json({ accessToken: token, role: 'user' })
            }
            return res.status(401).json({ message: 'Bad credentials' })
        } else {
            return res.status(401).json({ message: 'Bad credentials' })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Failed to login user' })
    }
}

const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const user = await User.findOne({ email: email })
        if (user && user.verification_status === false) {
            sendVerifyEmail(email, user._id)
            return res.status(409).json({ message: 'Please verify you email by clicking the link' })
        }
        if (user && user?.authProvider === 'google') {
            return res.status(409).json({ message: 'User has been logged in google ,Please use google sign in ' })
        }
        if (user && user.verification_status) {
            return res.status(409).json({ message: 'User already exists' })
        }
        if (!user) {
            const passwordHash = await bcrypt.hash(password, 10)
            const verificationTokenExpiry = new Date(Date.now() + 5 * 60 * 1000)
            const user = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: passwordHash,
                verification_status: false,
            })
            sendVerifyEmail(email, user._id)
            return res.status(201).json({ message: 'Please verify you email by clicking the link sent to your email' })
        }
    } catch (e) {
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg })
        }
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

const verifyEmail = async (req, res) => {
    const { token } = req.query
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            return res.send('Invalid link or the link has expired please register once more to continue')
        }
        const userId = decoded.userId
        const email = decoded.email
        try {
            const user = await User.findOneAndUpdate({
                _id: userId
            }, { verification_status: true, status: 'active', createdAt: null }, { new: true })
            return res.send('Account verified successfully please login to continue')
        } catch (error) {
            return res.status(500).json({ message: 'Failed to verify please try again later' })
        }

    })
}

const logout = (req, res) => {
    if (req.session) req.session.destroy()
    req.clearCookies('connect.sid', { httpOnly: true, secure: false })
    req.clearCookies('admin_jwt', { httpOnly: true, secure: false })
    return res.status(200).json({ message: 'User Logged out successfully' })
}

export {
    googleSigninCallback,
    signin,
    signUp,
    verifyEmail,
    logout
}