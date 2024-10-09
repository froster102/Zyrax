import { Product } from '../../model/product.js'
import { storage } from '../../config/firebaseConfig.js'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const addProduct = async (req, res) => {
    try {
        const { name, description, category, price, offer, stock, gender } = req.body
        function tranformStockData(stock) {
            const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
            const transformed = []
            validSizes.forEach(size => {
                const quantity = stock[size] === '' ? 0 : Number(stock[size])
                transformed.push({ size, quantity })
            })

            return transformed;
        }
        const transformedStockObj = tranformStockData(stock)
        const product = await Product.findOne({ name: name })
        if (product) return res.status(409).json({ message: 'Product already exists' })
        const images = req.files
        const imageUrls = []
        for (const image of images) {
            const { originalname, buffer } = image
            const storageRef = ref(storage, 'images/' + originalname)
            try {
                const snapshot = await uploadBytes(storageRef, buffer)
                const downloadUrl = await getDownloadURL(snapshot.ref)
                imageUrls.push(downloadUrl)
            } catch (err) {
                console.log(err)
            }
        }
        const response = await Product.create({
            name: name.toLowerCase(),
            description: description,
            category: category,
            price: price,
            offer: offer || null,
            stock: transformedStockObj,
            gender: gender,
            imageUrls: imageUrls,
            status: 'active'
        })
        return res.status(201).json({ message: 'Product created sucessfully' })
    } catch (err) {
        console.log(err)
        if (err?.errorResponse?.code === 11000) {
            return res.status(409).json({ message: 'Product already exists' })
        }
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg })
        }
        return res.status(500).json({ message: 'Failed to add product an error occured' })
    }
}

const getProducts = async (req, res) => {
    const { page = 1, limit = 0 } = req.query
    const skip = (page - 1) * limit
    try {
        const totalCount = await Product.countDocuments()
        const products = await Product.find({}).populate('category').skip(skip).limit(limit)
        if (!products) {
            return res.status(404).json({ message: 'No products found' })
        }
        return res.status(200).json({ products, totalCount })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to get products' })
    }
}

const viewProduct = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'No id provided' })
    }
    try {
        const product = await Product.findById(id).populate('category')
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        return res.status(200).json(product)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to get product' })
    }
}


const editProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, category, price, offer, stock, gender } = req.body
        function tranformStockData(stock) {
            const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
            const transformed = []
            validSizes.forEach(size => {
                const quantity = stock[size] === '' ? 0 : Number(stock[size])
                transformed.push({ size, quantity })
            })

            return transformed;
        }
        const transformedStockObj = tranformStockData(stock)
        const images = req.files
        const imageUrls = req.body?.images || []
        for (const image of images) {
            const { originalname, buffer } = image
            const storageRef = ref(storage, 'images/' + originalname)
            try {
                const snapshot = await uploadBytes(storageRef, buffer)
                const downloadUrl = await getDownloadURL(snapshot.ref)
                imageUrls.push(downloadUrl)
            } catch (err) {
                console.log(err)
            }
        }
        const product = await Product.findById(id)

        product.name = name
        product.description = description
        product.category = category
        product.price = price
        product.offer = offer || null
        product.stock = transformedStockObj
        product.gender = gender
        product.imageUrls = imageUrls

        await product.save()
        

        return res.status(200).json({ message: 'Product edited sucessfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to edit product an error occured' })
    }

}

const blockProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findOne({ _id: id })
        if (product.status === 'active') {
            const newProduct = await Product.findByIdAndUpdate(id, { status: 'blocked' }, { new: true })
            if (newProduct) return res.status(200).json({ message: 'Product blocked sucessfully' })
        } else if (product.status === 'blocked') {
            const newProduct = await Product.findByIdAndUpdate(id, { status: 'active' }, { new: true })
            if (newProduct) return res.status(200).json({ message: 'Product unblocked sucessfully' })
        }
    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const response = await Product.findByIdAndDelete(id)
        if (!response) {
            return res.status(404).json({ message: 'Product not found' })
        }
        return res.status(200).json({ message: 'Product deleted sucessfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to delete product' })
    }
}

export {
    addProduct,
    getProducts,
    viewProduct,
    editProduct,
    blockProduct,
    deleteProduct
}