import { Category } from '../../model/category.js'
import { Product } from '../../model/product.js'

// @desc Get products
// @route GET api/v1/user/products/
// @access Public
const getProducts = async (req, res) => {
    try {
        const { search, category, priceRange, exclude, offerPercentage, stock, latest = false, page = 1, limit = 0, gender = '', sort } = req.query
        const query = { status: 'active' }
        const sortOptions = {}
        if (gender) {
            query.gender = gender
        }
        if (search) {
            query.$text = { $search: search }
        }
        if (latest) {
            sortOptions.createdAt = -1
        }
        if (exclude) {
            query.name = { $ne: exclude }
        }
        if (category) {
            const foundCategory = await Category.findOne({ name: category }).populate()
            const categoryIds = [foundCategory._id, ...foundCategory.children]
            query.category = { $in: categoryIds }
        }
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number)
            query.price = { $gte: min, $lte: max }
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
        if (Boolean(stock)) {
            query['$expr'] = { $gt: [{ $sum: '$stock.quantity' }, 0] }
        }
        const skip = (page - 1) * limit
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
        }).populate('offer').sort(sortOptions).limit(parseInt(limit))
        if (offerPercentage) {
            const filteredProducts = products.filter(product => product.offer && product.offer.discountPercentage >= offerPercentage)
            return res.status(200).json(filteredProducts)
        }
        return res.status(200).json(products)
    } catch (error) {
        console.log(error)
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