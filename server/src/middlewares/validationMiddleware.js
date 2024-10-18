import mongoose from 'mongoose'
import { z } from 'zod'

const validateSignin = (req, res, next) => {
    const signinSchema = z.object({
        email: z.string().trim().email('Enter a valid email'),
        password: z.string().min(1, 'Password is required')
    })
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
            const errors = []
            for (let e of error.errors) {
                errors.push(e.message)
            }
            return res.status(400).json({ message: errors })
        }
    }
}

const validateResetPassword = (req, res, next) => {
    const resetPasswordSchema = z.object({
        token: z.string().min(1, 'Token not found'),
        password: z.string()
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, 'Password must be 6 character long and should contain a letter,number,a special character')
    })
    try {
        resetPasswordSchema.parse(req.body)
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

const validateGetProducts = (req, res, next) => {
    const getProductsSchema = z.object({
        category: z.string().trim().regex(/^[A-Za-z\s-:]+$/, 'Category name must be a valid string').optional(),
        exclude: z.string().trim().regex(/^[A-Za-z\s-:]+$/, 'Product name to be excluded must be a valid string').optional(),
        gender: z.enum(['men', 'women'], {
            errorMap: (issue, context) => {
                if (issue.code === 'invalid_enum_value') {
                    return { message: 'Gender must be either "men" or "women"' }
                }
                return { message: context.defaultError }
            }
        }).optional(),
        latest: z.string().refine(v => v === 'true' || v === 'false', { message: 'Latest query param must be either true or false' }).optional(),
        sort: z.enum(['L2H', 'H2L', 'A2Z', 'Z2A', 'newest'], {
            errorMap: (issue, context) => {
                if (issue.code === 'invalid_enum_value') {
                    return { message: 'Sorting value must be either of values "L2H" (lowest - highest) "H2L" (highest - lowest) "A2Z" (A - Z) "Z2A" (Z - A) "newest"' }
                }
                return { message: context.defaultError }
            }
        }).optional()
    })
    try {
        getProductsSchema.parse(req.query)
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

const validateObjectId = (req, res, next) => {
    try {
        const objectIdSchema = z.object({
            itemId: z.string().refine(v => mongoose.Types.ObjectId.isValid(v), {
                message: 'ID not valid'
            })
        })
        objectIdSchema.parse(req.params)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message })
        }
    }
}

export {
    validateSignin,
    validateEmail,
    validatePassword,
    validateResetPassword,
    validateGetProducts,
    validateObjectId
}