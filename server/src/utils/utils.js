import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const generateAccessToken = (userId, role) => {
    return jwt.sign({
        userId: userId,
        role: role
    }, process.env.SECRET, { expiresIn: '1h' })
}

const generateRefreshToken = (userId, role) => {
    return jwt.sign({
        userId: userId,
        role: role
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
        }, process.env.SECRET, { expiresIn: '2m' })
        const url = `${process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_BACKEND_DOMAIN : process.env.PRODUCTION_BACKEND_DOMAIN}/api/v1/user/auth/verify-email?token=${token}`
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
    }
}

const sendResetEmail = async (email, username, userId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.VERIFICATION_EMAIL,
            pass: process.env.VERIFICATION_EMAIL_PASSWORD
        }
    })
    try {
        const token = jwt.sign({
            email,
            userId
        }, process.env.SECRET, { expiresIn: '15m' })
        //sending to client side with token
        const resetLink = `${process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_FRONTEND_DOMAIN : process.env.PRODUCTION_FRONTEND_DOMAIN}/reset-password/${token}`
        const mailOptions = {
            from: process.env.VERIFICATION_EMAIL,
            to: email,
            subject: 'Zyrax account password reset',
            html: `
            <div style="font-family:Arial,sans-serif,line-height:1.5; color:#333">
            <h2>Hello ${username}</h2>
            <p>We recived a request to reset the password for your account at our Zyrax store.</p>
            <p>To reset your password, please click the button below</p>
            <button
            style = "padding-left:0.5rem;padding-right:0.5rem;padding-top:1rem;padding-bottom:1rem;background-color:black;border-radius:10px"
            ><a style="color:white;text-decoration:none;" href="${resetLink}">Reset your password</a> </button>
            <p>If you did not request a password reset, please ignore this email</p>
            <p>Thank you,<br>The Zyrax Store</p>
            <hr>
            </div>`
        }
        const response = await transporter.sendMail(mailOptions)
        return response
    } catch (error) {
    }
}


export {
    generateAccessToken,
    generateRefreshToken,
    sendResetEmail,
    sendVerifyEmail
}