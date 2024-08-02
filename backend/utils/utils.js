import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const generateAccessToken = (userId, role) => {
    return jwt.sign({
        'userId': userId,
        'role': role
    }, process.env.SECRET, { expiresIn: '10s' })
}

const generateRefreshToken = (userId, role) => {
    return jwt.sign({
        'userId': userId,
        'role': role
    }, process.env.SECRET, { expiresIn: '1d' })
}

const sendVerifyEmail = async (email, userId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.VERIFICATION_EMAIL,
            pass: process.env.VERIFICATION_EMAIL_PASSWORD
        }
    })
    try {
        const token = jwt.sign({
            email: email,
            userId: userId
        }, process.env.SECRET, { expiresIn: '15m' })
        const url = `http://localhost:3000/verify-email?token=${token}`
        const mailOptions = {
            from: process.env.VERIFICATION_EMAIL,
            to: email,
            subject: 'Verify your zyrax account',
            html: `<p>Please verify your account by clicking the following link<p>
             <a href="${url}" target='_blank' rel='noopener noreferrer'>Verify</a>`
        }
        const response = await transporter.sendMail(mailOptions)
        return response
    } catch (error) {
        console.log(error)
    }
}


export {
    generateAccessToken,
    generateRefreshToken,
    sendVerifyEmail
}