import express from 'express'

import { getAllCategories } from "../controller/user/categoryiesController.js"
import { getProductDeatils, getProducts } from "../controller/user/productController.js"
import { searchProducts } from "../controller/user/searchController.js"
import { validateGetProducts } from "../middlewares/validationMiddleware.js"

const router = express.Router()

router.get('/search', searchProducts)
router.get('/', validateGetProducts, getProducts)
router.get('/categories', getAllCategories)
router.get('/:name', getProductDeatils)

export default router