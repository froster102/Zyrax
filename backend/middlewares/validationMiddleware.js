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

const passwordSchema = z.object({
    password: z.string()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, 'Password must be 6 character long and should contain a letter,number,a special character')
})

const validatePassword = (req, res, next) => {
    try {
        passwordSchema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = []
            for (let e of error.errors) {
                errors.push(e.message)
            }
            return res.status(400).json({message:errors})
        }
    }
}


export {
    validateSignin,
    validatePassword
}