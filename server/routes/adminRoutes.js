import express from 'express'
import { adminAuth } from '../middlewares/authMiddleware.js'
import multer from 'multer'
import * as authController from '../controller/admin/authController.js'
import * as userController from '../controller/admin/userController.js'
import * as orderController from '../controller/admin/orderController.js'
import * as productController from '../controller/admin/productController.js'
import * as categoryController from '../controller/admin/categoryController.js'
import * as returnController from '../controller/admin/returnController.js'
import * as couponController from '../controller/admin/couponController.js'

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/auth/signin', authController.signin)

router.use(adminAuth)

router.get('/users', userController.getUsers)
router.get('/users/:id', userController.viewUser)
router.patch('/users/:id/block', userController.blockUser)
router.patch('/users/:id/unblock', userController.unblockUser)
router.delete('/users/:id', userController.deleteUser)

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.viewProduct)
router.post('/products', upload.array('images'), productController.addProduct)
router.put('/products/:id', upload.array('images'), productController.editProduct)
router.patch('/products/:id/block', productController.blockProduct)
router.delete('/products/:id', productController.deleteProduct)

router.get('/orders/', orderController.getAllOrders)
router.patch('/orders/:orderId/products/:itemId/status', orderController.changeProductOrderStatus)

router.get('/returns', returnController.getAllReturns)
router.put('/returns', returnController.approveReturn)

router.get('/coupons', couponController.getCoupons)
router.post('/coupons', couponController.addCoupon)
router.delete('/coupons/:couponId', couponController.deleteCoupon)

router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.addCategory)
router.put('/categories/:id', categoryController.editCategory)
router.patch('/categories/:id/block', categoryController.blockCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

router.get('/logout', authController.logout)


export default router