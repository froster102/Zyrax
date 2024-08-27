import express from 'express'
import { passport } from '../middlewares/passport-config.js'
import { signin, googleSigninCallback, signUp } from '../controller/user/userAuthController.js'
import { logout } from '../controller/logoutController.js'
import { getProductDeatils, getProducts } from '../controller/user/userProductController.js'
import { getProfile } from '../controller/user/userProfileController.js'
import { userAuth } from '../middlewares/authMiddleware.js'
import { addWishlistItems, getWishlistItems, removeWishlistItem } from '../controller/user/userWishlistController.js'
import { addCartItems, getCartItems, removeCartItem } from '../controller/user/userCartController.js'
import { getAllCategories } from '../controller/user/userCategoryiesController.js'
import {validatePassword, validateSignin} from '../middlewares/validationMiddleware.js'

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
router.post('/auth/signin',validateSignin, signin)
router.post('/auth/signup',validatePassword, signUp)
router.get('/products', getProducts)
router.get('/products/:name', getProductDeatils)

router.use(userAuth)

router.get('/addresses')
router.post('/addresses')
router.put('/addresses')
router.delete('/addresses')

router.get('/wishlist', getWishlistItems)
router.post('/wishlist', addWishlistItems)
router.delete('/wishlist', removeWishlistItem)

router.get('/cart', getCartItems)
router.post('/cart', addCartItems)
router.delete('/cart', removeCartItem)

router.get('/categories', getAllCategories)

router.get('/me', getProfile)
router.post('/me')
router.put('/me')
router.delete('/me')

router.get('/auth/logout', logout)


export default router