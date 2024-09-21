import express from 'express'
import { passport } from '../middlewares/passport-config.js'
import * as wishlistController from '../controller/user/wishlistController.js'
import * as cartController from '../controller/user/cartController.js'
import * as orderController from '../controller/user/orderController.js'
import { signin, googleSigninCallback, signUp, forgotPassword, resetPassword, verifyEmail } from '../controller/user/authController.js'
import { logout } from '../controller/logoutController.js'
import { getProfile, updateProfile } from '../controller/user/profileController.js'
import { userAuth } from '../middlewares/authMiddleware.js'
import { validateEmail, validatePassword, validateResetPassword, validateSignin, validateObjectId } from '../middlewares/validationMiddleware.js'
import { addAddress, deleteAddress, updateAddress } from '../controller/user/addressController.js'
import { handleCheckOut } from '../controller/user/checkoutController.js'
import { verifyPayment } from '../controller/user/verifyPaymentController.js'
import { verifyWalletPayment } from '../controller/user/verifyWalletPaymentController.js'
import { createWallet, getWalletDetails, topUpWallet } from '../controller/user/walletController.js'
import { searchProducts } from '../controller/user/searchController.js'
import { validateGetProducts } from '../middlewares/validationMiddleware.js'
import { getProductDeatils, getProducts } from '../controller/user/productController.js'
import { getAllCategories } from '../controller/user/categoryiesController.js'
import * as couponController from '../controller/user/couponController.js'

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
router.get('/auth/verify-email', verifyEmail)

router.get('/products/search', searchProducts)
router.get('/products', validateGetProducts, getProducts)
router.get('/products/categories', getAllCategories)
router.get('/products/:name', getProductDeatils)

router.post('/verify-wallet-payment', verifyWalletPayment)

router.use(userAuth)

router.post('/wishlist/items', wishlistController.addWishlistItems)
router.get('/wishlist', wishlistController.getWishlistItems)
router.delete('/wishlist/items/:itemId', validateObjectId, wishlistController.removeWishlistItem)

router.post('/cart/items', cartController.addCartItems)
router.get('/cart', cartController.getCartItems)
router.put('/cart/items/:itemId', cartController.updateCartItems)
router.delete('/cart/items/:itemId', validateObjectId, cartController.removeCartItem)

router.get('/coupons', couponController.getCoupons)
router.post('/coupons/validate', couponController.validateCoupon)
router.post('/coupons/apply', couponController.applyCoupon)
router.delete('/coupons/remove', couponController.removeCoupon)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.delete('/profile')

router.post('/addresses', addAddress)
router.put('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)

router.post('/checkout', handleCheckOut)
router.post('/payments/verify', verifyPayment)
router.post('/wallet/payments/verify')

router.get('/wallet', getWalletDetails)
router.post('/wallet', createWallet)
router.put('/wallet', topUpWallet)


router.get('/orders', orderController.getUserOrders)
router.get('/orders/details/', orderController.getOrderDetails)
router.patch('/orders/:orderId/products/:productId/cancel', orderController.cancelOrder)
router.post('/orders/:orderId/products/:productId/return', orderController.returnOrder)

router.get('/auth/logout', logout)

export default router