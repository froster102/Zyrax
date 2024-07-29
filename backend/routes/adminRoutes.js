import express from 'express'
import { signin } from '../controller/admin/adminAuthController.js'
import { blockUser, deleteUser, getUsers, viewUser } from '../controller/admin/adminUserController.js'
import { addProduct, deleteProduct, editProduct, getProducts, viewProduct } from '../controller/admin/productController.js'
import { signinValidationRules, validate } from '../middlewares/validationMiddleware.js'
import { adminAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/auth/signin', signinValidationRules(), validate, signin)

router.use(adminAuth)

router.get('/users', getUsers)
router.get('/view-user', viewUser)
router.post('/block-user', blockUser)
router.post('/delete-user', deleteUser)
router.post('/add-product', addProduct)
router.get('/get-products', getProducts)
router.get('/view-product', viewProduct)
router.post('/edit-product', editProduct)
router.post('/delete-product', deleteProduct)


export default router