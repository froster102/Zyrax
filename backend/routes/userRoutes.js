import express from 'express'
import { passport } from '../middlewares/passport-config.js'
import { signin, googleSigninCallback, facebookSigninCallback, xSigninCallback, signUp, verifyEmail } from '../controller/user/userAuthController.js'
import { signUpValidationRules, validate } from '../middlewares/validationMiddleware.js'

const router = express.Router() 

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }), googleSigninCallback)
router.get('/auth/facebook',)
router.get('/auth/facebook/callback', facebookSigninCallback)
router.get('/auth/X',)
router.get('/auth/X/callback', xSigninCallback)
router.post('/auth/signin', signin)
router.post('/auth/signup',signUpValidationRules(),validate, signUp)






export default router