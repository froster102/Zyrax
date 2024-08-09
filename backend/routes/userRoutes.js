import express from 'express'
import { passport } from '../middlewares/passport-config.js'
import { signin, googleSigninCallback, signUp } from '../controller/user/userAuthController.js'
import { signUpValidationRules, validate } from '../middlewares/validationMiddleware.js'
import { logout } from '../controller/logoutController.js'
import { getProductDeatils, getProducts } from '../controller/user/userProductController.js'
import { getProfile } from '../controller/user/userProfileController.js'
import { userAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }), googleSigninCallback)
router.post('/auth/signin', signin)
router.post('/auth/signup', signUpValidationRules(), validate, signUp)
router.get('/products', getProducts)
router.get('/products/:name', getProductDeatils)

router.use(userAuth)

router.get('/me', getProfile)
router.get('/auth/logout', logout)


export default router