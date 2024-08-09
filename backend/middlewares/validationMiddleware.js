import { body, validationResult } from 'express-validator'

const signUpValidationRules = () => {
    return [
        body('firstName').notEmpty().withMessage('First Name field required'),
        body('lastName').notEmpty().withMessage('Last Name field required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password required'),
    ]
}

const signinValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Field Required')
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let errMsg = []
        const errorArr = errors.array()
        for (let error of errorArr) {
            errMsg.push(error.msg)
        }
        return res.status(400).json({ message: 'Bad request', errMsg })
    }
    next()
}

export {
    signUpValidationRules,
    signinValidationRules,
    validate
}