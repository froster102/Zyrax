import express from 'express'
import { passport } from '../middlewares/passport-config.js'
import { signin, googleSigninCallback, signUp, forgotPassword, resetPassword } from '../controller/user/userAuthController.js'
import { logout } from '../controller/logoutController.js'
import { getProductDeatils, getProducts } from '../controller/user/userProductController.js'
import { getProfile, updateProfile } from '../controller/user/userProfileController.js'
import { userAuth } from '../middlewares/authMiddleware.js'
import { addWishlistItems, getWishlistItems, removeWishlistItem } from '../controller/user/userWishlistController.js'
import { addCartItems, getCartItems, removeCartItem } from '../controller/user/userCartController.js'
import { getAllCategories } from '../controller/user/userCategoryiesController.js'
import { validateEmail, validateGetProducts, validatePassword, validateResetPassword, validateSignin, validateObjectId } from '../middlewares/validationMiddleware.js'
import { addAddress, deleteAddress, updateAddress } from '../controller/user/userAddressController.js'
import { cancelOrder, getUserOrders } from '../controller/user/userOrderController.js'
import { handleCheckOut } from '../controller/user/userCheckoutController.js'
import { searchProducts } from '../controller/userSearchController.js'
import { verifyPayment } from '../controller/user/verifyPaymentController.js'
import { verifyWalletPayment } from '../controller/user/verifyWalletPaymentController.js'
import { createWallet, getWalletDetails, topUpWallet } from '../controller/user/userWalletController.js'

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
router.post('/auth/signin', validateSignin, signin)
router.post('/auth/signup', validatePassword, signUp)
router.post('/auth/forgot-password', validateEmail, forgotPassword)
router.post('/auth/reset-password', validateResetPassword, resetPassword)

router.get('/products', validateGetProducts, getProducts)
router.get('/products/:name', getProductDeatils)

router.get('/categories', getAllCategories)

router.get('/search', searchProducts)

router.post('/verify-payment', verifyPayment)
router.post('/verify-wallet-payment', verifyWalletPayment)

router.use(userAuth)

router.get('/wishlist', getWishlistItems)
router.post('/wishlist', addWishlistItems)
router.delete('/wishlist/:itemId', validateObjectId, removeWishlistItem)

router.get('/cart', getCartItems)
router.post('/cart', addCartItems)
router.delete('/cart/:itemId', validateObjectId, removeCartItem)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.delete('/profile')

router.post('/addresses', addAddress)
router.put('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)

router.post('/checkout', handleCheckOut)

router.get('/wallets', getWalletDetails)
router.post('/wallets', createWallet)
router.put('/wallets', topUpWallet)


router.get('/orders', getUserOrders)
router.patch('/orders/:orderId/products/:productId/cancel', cancelOrder)

router.get('/auth/logout', logout)

export default router