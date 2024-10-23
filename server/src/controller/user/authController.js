import { User } from "../../model/user.js"
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken, sendResetEmail, sendVerifyEmail } from '../../utils/utils.js'
import jwt from 'jsonwebtoken'
import { AnalyticsEvent } from "../../model/analytics.js"
import { oauth2client } from "../../config/googleAuthConfig.js"

// @desc Verify authorization code and sigin the user 
// @route POST api/v1/user/auth/google
// @access Public
export const googleSignin = async (req, res) => {
    const { authCode } = req.query
    try {
        const googleResponse = await oauth2client.getToken(authCode)
        oauth2client.setCredentials(googleResponse.tokens)
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)
        if (!response.ok) {
            throw new Error('Google auth failed')
        }
        const data = await response.json()
        const { email, name, given_name, id, picture } = data
        const user = await User.findOne({ email })
        let userId = user ? user._id : null
        if (user && user.status === 'blocked') return res.status(400).json({ message: 'User account has been blocked' })
        if (!user) {
            const newUser = await User.create({
                firstName: name,
                lastName: name || given_name,
                email: email,
                googleId: id,
                authProvider: 'google',
                profilePic: picture,
                status: 'active',
                verification_status: true,
                verification_started: null,
                createdAt: null
            })
            userId = newUser._id
        }
        const accessToken = generateAccessToken(userId, 'user')
        const refreshToken = generateRefreshToken(userId, 'user')
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: process.env.NODE_ENV !== 'development' ? 'None' : '',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({ accessToken, role: 'user' })
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

// @desc Signin user
// @route POST api/v1/user/auth/signin
// @access Public
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (user?.authProvider) return res.status(400).json({
            errorType: 'googleLogin',
            message: 'Email has used with google login, Please use google sign in'
        })
        if (user) {
            if (user.status === 'blocked') {
                return res.status(401).json({ message: 'User account blocked' })
            }
            const match = await bcrypt.compare(password, user.password)
            if (!user.verification_status) {
                return res.status(400).json({ message: 'Please verify your account by clicking the link send to your email' })
            }
            if (match && user.verification_status) {
                await User.findOneAndUpdate({ _id: user._id }, { lastLogin: Date.now() })
                await AnalyticsEvent.create({
                    userId: user._id,
                    eventType: 'login'
                })
                const token = generateAccessToken(user._id, 'user')
                const refreshToken = generateRefreshToken(user._id, 'user')
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV !== 'development' ? 'None' : '',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.status(200).json({ accessToken: token, role: 'user' })
            }
            return res.status(401).json({ message: 'Bad credentials' })
        } else {
            return res.status(401).json({ message: 'Bad credentials' })
        }
    } catch (e) {
        return res.status(500).json({ message: 'Failed to login user' })
    }
}

// @desc Signup user
// @routes POST /api/v1/user/auth/signup
// @access Public
export const signUp = async (req, res) => {
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
            const response = await sendVerifyEmail(email, user._id)
            if (response) return res.status(201).json({ message: 'Please verify you email by clicking the link sent to your email' })
        }
    } catch (e) {
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ message: errMsg })
        }
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

// @desc Send forgot password request of user
// @routes POST /api/v1/user/auth/forgot-password
// @access Public
export const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email: email })
    if (!user || user.verification_status === false) return res.status(404).json({ message: 'User not found' })
    if (user.authProvider === 'google') return res.status(400).json({ message: 'Account have already signed in with google please use google sign in' })
    const response = await sendResetEmail(email, user.firstName, user._id)
    if (response) return res.status(200).json({ message: 'An email has been sent to your mail follow the email to reset the password' })
}

// @desc Reset user password
// @routes POST /api/v1/user/auth/reset-password
// @access Public
export const resetPassword = async (req, res) => {
    const { token, password } = req.body
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid link or link has been expired please try again' })
        }
        const { userId } = decoded
        const { password: oldPasswordHash } = await User.findOne({ _id: userId }, { password: true })
        const checkOld = await bcrypt.compare(password, oldPasswordHash)
        if (checkOld) return res.status(400).json({ message: 'New password cannot be same as the current password' })
        const newPasswordHash = await bcrypt.hash(password, 10)
        const response = await User.findByIdAndUpdate(userId, { password: newPasswordHash }, { new: true })
        if (response) return res.status(200).json({ message: 'Password updated sucessfully' })
    })

}

// @desc Verify user emailexport 
// @routes GET /api/v1/user/auth/verify-email
// @access Public
export const verifyEmail = async (req, res) => {
    const { token } = req.query
    if (!token) return res.status(400).json({ message: 'Token not found' })
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            return res.send('Invalid link or the link has expired please register once more to continue')
        }
        const userId = decoded.userId
        const email = decoded.email
        try {
            const user = await User.findOneAndUpdate({
                _id: userId
            }, { verification_status: true, status: 'active', $set: { verification_started: null } }, { new: true })
            return res.send('Account verified successfully please login to continue')
        } catch (error) {
            return res.status(500).json({ message: 'Failed to verify please try again later' })
        }

    })
}


