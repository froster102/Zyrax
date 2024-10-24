import express from 'express'
import * as wishlistController from '../controller/user/wishlistController.js'
import * as cartController from '../controller/user/cartController.js'
import * as orderController from '../controller/user/orderController.js'
import { logout } from '../controller/logoutController.js'
import { getProfile, updateProfile } from '../controller/user/profileController.js'
import { userAuth } from '../middlewares/authMiddleware.js'
import { validateEmail, validatePassword, validateResetPassword, validateSignin, validateObjectId } from '../middlewares/validationMiddleware.js'
import { addAddress, deleteAddress, updateAddress } from '../controller/user/addressController.js'
import { verifyPayment } from '../controller/user/verifyPaymentController.js'
import { verifyWalletPayment } from '../controller/user/verifyWalletPaymentController.js'
import { createWallet, getWalletDetails, topUpWallet } from '../controller/user/walletController.js'
import * as couponController from '../controller/user/couponController.js'
import * as analyticsController from '../controller/user/analyticsController.js'
import * as authController from '../controller/user/authController.js'

const router = express.Router()

router.post('/auth/google', authController.googleSignin)
router.post('/auth/signin', validateSignin, authController.signin)
router.post('/auth/signup', validatePassword, authController.signUp)
router.post('/auth/forgot-password', validateEmail, authController.forgotPassword)
router.post('/auth/reset-password', validateResetPassword, authController.resetPassword)
router.get('/auth/verify-email', authController.verifyEmail)

router.get('/analytics/event', analyticsController.trackVisits)

router.use(userAuth)

router.post('/wishlist/items', wishlistController.addWishlistItems)
router.get('/wishlist', wishlistController.getWishlistItems)
router.delete('/wishlist/items/:itemId', validateObjectId, wishlistController.removeWishlistItem)

router.post('/cart/items', cartController.addCartItems)
router.get('/cart', cartController.getCartItems)
router.put('/cart/items/:itemId', cartController.updateCartItems)
router.delete('/cart/items/:itemId', validateObjectId, cartController.removeCartItem)

router.get('/coupons', couponController.getCoupons)
router.post('/coupons/apply', couponController.applyCoupon)
router.delete('/coupons/remove', couponController.removeCoupon)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.delete('/profile')

router.post('/addresses', addAddress)
router.put('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)

router.post('/payments/verify', verifyPayment)
router.post('/wallet/payments/verify', verifyWalletPayment)

router.get('/wallet', getWalletDetails)
router.post('/wallet', createWallet)
router.put('/wallet', topUpWallet)

router.get('/orders', orderController.getUserOrders)
router.post('/orders/checkout', orderController.checkout)
router.get('/orders/details/', orderController.getOrderDetails)
router.patch('/orders/:orderId/products/:productId/cancel', orderController.cancelOrder)
router.post('/orders/:orderId/products/:productId/return', orderController.returnOrder)
router.post('/orders/:orderId/retry', orderController.retryPayment)

router.get('/auth/logout', logout)

export default router