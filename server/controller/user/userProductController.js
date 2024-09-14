import { Category } from '../../model/category.js'
import { Product } from '../../model/product.js'

const getProducts = async (req, res) => {
    try {
        const { category, exclude = '', latest = false, limit = 0, gender = '', sort } = req.query
        const categoryData = await Category.findOne({ name: category }).populate({
            path: 'children'
        })
        if (!categoryData) return res.status(404).json({ message: 'Category not found' })
        if (categoryData.status === 'blocked') return res.status(404).json({ message: 'Category not available' })
        const activeCatergoryIds = []
        if (categoryData.parent === null) {
            if (categoryData.status === 'active') {
                activeCatergoryIds.push(categoryData._id)
                categoryData.children.map((child) => {
                    if (child.status === 'active') {
                        activeCatergoryIds.push(child._id)
                    }
                })
            }
        } else {
            const parentCategory = await Category.findOne({ _id: categoryData.parent })
            if (parentCategory && parentCategory.status === 'active') {
                activeCatergoryIds.push(categoryData._id)
            }
        }
        const sortQuery = {}
        if (latest) {
            sortQuery.createdAt = -1
        } else {
            switch (sort) {
                case 'L2H': {
                    sortQuery.price = 1
                    break
                }
                case 'H2L': {
                    sortQuery.price = -1
                    break
                }
                case 'A2Z': {
                    sortQuery.name = 1
                    break
                }
                case 'Z2A': {
                    sortQuery.name = -1
                    break
                }
                case 'newest': {
                    sortQuery.createdAt = -1
                    break
                }
                default: {
                    sortQuery._id = 1
                }
            }
        }
        const products = await Product.aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $match: {
                    'category._id': { $in: activeCatergoryIds },
                    'category.status': 'active',
                    gender: gender,
                    name: { $ne: exclude },
                    status: 'active'
                }
            },
            {
                $sort: sortQuery
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    imageUrls: 1,
                    'category.name': 1,
                }
            }
        ])
        return res.status(200).json(products)
    } catch (error) {
        console.log(error)
    }
}

const getProductDeatils = async (req, res) => {
    try {
        const { name } = req.params
        const product = await Product.findOne({ name: name, status: 'active' }, { name: true, price: true, stock: true, description: true, imageUrls: true, stockQty: true }).populate({
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