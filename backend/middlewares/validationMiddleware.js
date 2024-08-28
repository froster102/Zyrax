import signinSchema from "../ValidationSchema/signinSchema.js";
import { z } from 'zod'

const validateSignin = (req, res, next) => {
    try {
        signinSchema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = []
            for (let e of error.errors) {
                errors.push({ message: e.message })
            }
            return res.status(400).json(errors)
        }
    }
}

const validateEmail = (req, res, next) => {
    const emailSchema = z.object({
        email: z.string().email('Enter a valid email')
    })
    try {
        emailSchema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = []
            for (let e of error.errors) {
                errors.push(e.message)
            }
            return res.status(400).json({ message: errors })
        }
    }
}

const validatePassword = (req, res, next) => {
    const passwordSchema = z.object({
        password: z.string().min(6, 'Password must be at least 6 character long')
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, 'Password must be 6 character long and should contain a letter,number,a special character')
    })
    try {
        passwordSchema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log(error)
            const errors = []
            for (let e of error.errors) {
                errors.push(e.message)
            }
            return res.status(400).json({ message: errors })
        }
    }
}

const validateResetPassword = (req, res, next) => {
    const schema = z.object({
        token: z.string().min(1, 'Token not found'),
        password: z.string()
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, 'Password must be 6 character long and should contain a letter,number,a special character')
    })
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = []
            for (let e of error.errors) {
                errors.push(e.message)
            }
            return res.status(400).json({ message: errors })
        }
    }
}


export {
    validateSignin,
    validateEmail,
    validatePassword,
    validateResetPassword
}