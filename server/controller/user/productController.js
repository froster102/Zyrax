import { Category } from '../../model/category.js'
import { Product } from '../../model/product.js'

// @desc Get products
// @route GET api/v1/user/products/
// @access Public
const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, exclude, offerPercentage, stock, latest = false, page = 1, limit = 0, gender = '', sort } = req.query
        const query = { status: 'active' }
        const sortOptions = {}
        if (gender) {
            query.gender = gender
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' }
        }
        if (latest) {
            sortOptions.createdAt = -1
        }
        if (exclude) {
            query.name = { $ne: exclude }
        }
        if (category) {
            const foundCategory = await Category.findOne({ name: category, status: 'active' }).populate({
                path: 'parent',
                match: {
                    status: 'active'
                }
            }).populate({
                path: 'children',
                match: { status: 'active' }
            })
            const categoryIds = [foundCategory?._id, ...foundCategory.children]
            query.category = { $in: categoryIds }
        }
        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) {
                query.price.$gte = minPrice
            }
            if (maxPrice) {
                query.price.$lte = maxPrice
            }
        }
        if (sort) {
            switch (sort) {
                case 'L2H': {
                    sortOptions.price = 1
                    break
                }
                case 'H2L': {
                    sortOptions.price = -1
                    break
                }
                case 'A2Z': {
                    sortOptions.name = 1
                    break
                }
                case 'Z2A': {
                    sortOptions.name = -1
                    break
                }
                case 'newest': {
                    sortOptions.createdAt = -1
                    break
                }
                default: {
                    sortOptions._id = 1
                }
            }
        }
        if (stock === 'inStock') {
            query['$expr'] = { $gt: [{ $sum: '$stock.quantity' }, 0] }
        }
        if (stock === 'outOfStock') {
            query['$expr'] = { $eq: [{ $sum: '$stock.quantity' }, 0] }
        }
        const skip = (page - 1) * limit
        const totalCount = await Product.countDocuments(query)
        const products = await Product.find(query).populate({
            path: 'category',
            match: {
                status: 'active'
            },
            populate: {
                path: 'parent',
                match: {
                    status: 'active'
                }
            }
        }).populate('offer').sort(sortOptions).skip(skip).limit(parseInt(limit))
        if (offerPercentage) {
            const filteredProducts = products.filter(product => product.offer && product.offer.discountPercentage >= Number(offerPercentage))
            return res.status(200).json({ products: filteredProducts, totalCount })
        }
        return res.status(200).json({ products, totalCount })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to get products' })
    }
}

// @desc Get a product detail
// @route GET api/v1/user/products/
// @access Public
const getProductDeatils = async (req, res) => {
    try {
        const { name } = req.params
        const product = await Product.findOne({ name: name, status: 'active' }, { name: true, price: true, offer: true, stock: true, description: true, imageUrls: true, stockQty: true }).populate({
            path: 'category',
            populate: {
                path: 'parent'
            }
        }).populate('offer')
        if (!product || product.category.status === 'blocked' || product.category.parent.status === 'blocked') return res.status(404).json({ message: 'Product either removed or not found' })
        return res.status(200).json(product)
    } catch (error) {
        console.log(error)
    }
}

export {
    getProducts,
    getProductDeatils
}