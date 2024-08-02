import express from 'express'
import { logout, signin } from '../controller/admin/adminAuthController.js'
import { blockUser, deleteUser, getUsers, unblockUser, viewUser } from '../controller/admin/adminUserController.js'
import { addProduct, deleteProduct, editProduct, getProducts, viewProduct } from '../controller/admin/productController.js'
import { signinValidationRules, validate } from '../middlewares/validationMiddleware.js'
import { adminAuth } from '../middlewares/authMiddleware.js'
import { adminRefresh } from '../controller/refreshController.js'

const router = express.Router()

router.post('/auth/signin', signinValidationRules(), validate, signin)
router.get('/auth/refresh',adminRefresh)


router.use(adminAuth)

router.get('/get-users', getUsers)
router.get('/view-user', viewUser)
router.post('/block-user', blockUser)
router.post('/unblock-user', unblockUser)
router.post('/delete-user', deleteUser)
router.post('/add-product', addProduct)
router.get('/get-products', getProducts)
router.get('/view-product', viewProduct)
router.post('/edit-product', editProduct)
router.post('/delete-product', deleteProduct)
router.get('/logout',logout)


export default router