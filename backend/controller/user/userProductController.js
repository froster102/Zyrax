import { Category } from '../../model/category.js'
import { Product } from '../../model/product.js'

const getProducts = async (req, res) => {
    try {
        const { category, exclude = '', latest = false, limit = 0, gender = '' } = req.query
        const categoryData = await Category.findOne({ name: category })
        if (!categoryData || categoryData.status === 'blocked') return res.status(404).json({ message: 'Category either blocked or not found' })
        if (latest && category) {
            const products = await Product.find({ category: categoryData._id, status: 'active', gender: gender }, { name: true, price: true, imageUrls: true, createdAt: true }).populate({
                path: 'category',
                select: 'name'
            }).sort({ createdAt: -1 }).limit(limit)
            return res.status(200).json(products)
        }
        const filter = { category: categoryData._id, status: 'active', gender: gender }
        if (exclude) filter.name = { $ne: exclude }
        const products = await Product.find(filter, { name: true, price: true, imageUrls: true }).populate({
            path: 'category',
            select: 'name'
        })
        return res.status(200).json(products)
    } catch (error) {
        console.log(error)
    }
}

const getProductDeatils = async (req, res) => {
    try {
        const { name } = req.params
        const product = await Product.findOne({ name: name, status: 'active' }, { name: true, price: true, sizes: true, description: true, imageUrls: true, _id: false }).populate({
            path: 'category',
            select: 'name status'
        })
        if (!product || product.category.status === 'blocked') return res.status(404).json({ message: 'Product either removed or not found' })
        return res.status(200).json(product)
    } catch (error) {
        console.log(error)
    }
}

export {
    getProducts,
    getProductDeatils
}