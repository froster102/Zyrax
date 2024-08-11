import express from 'express'
import { logout, signin } from '../controller/admin/adminAuthController.js'
import { blockUser, deleteUser, getUsers, unblockUser, viewUser } from '../controller/admin/adminUserController.js'
import { addProduct, blockProduct, deleteProduct, editProduct, getProducts, viewProduct } from '../controller/admin/adminProductController.js'
import { signinValidationRules, validate } from '../middlewares/validationMiddleware.js'
import { adminAuth } from '../middlewares/authMiddleware.js'
import multer from 'multer'
import { addCategory, blockCategory, deleteCategory, editCategory, getCategories } from '../controller/admin/AdminCategoryController.js'

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/auth/signin', signinValidationRules(), validate, signin)

router.use(adminAuth)

router.get('/users', getUsers)
router.get('/users/:id', viewUser)
router.patch('/users/:id/block', blockUser)
router.patch('/users/:id/unblock', unblockUser)
router.delete('/users/:id', deleteUser)

router.get('/products', getProducts)
router.get('/products/:id', viewProduct)
router.post('/products', upload.array('images'), addProduct)
router.put('/products/:id', upload.array('images'), editProduct)
router.patch('/products/:id/block', blockProduct)
router.delete('/products/:id', deleteProduct)

router.get('/categories', getCategories)
router.post('/categories', addCategory)
router.put('/categories/:id', editCategory)
router.patch('/categories/:id/block', blockCategory)
router.delete('/categories/:id', deleteCategory)
router.get('/logout', logout)


export default router