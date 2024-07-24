import express from 'express'
import { login } from '../controller/admin/adminActionController.js'
import { blockUser, deleteUser, getUsers, viewUser } from '../controller/admin/adminUserController.js'
import { addProduct, deleteProduct, editProduct, getProducts, viewProduct } from '../controller/admin/productController.js'

const router = express.Router()

router.post('/login', login)
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