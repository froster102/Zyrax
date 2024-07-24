import { Product } from '../../model/product.js'
import { Catergory } from '../../model/catergory.js'

const addProduct = async (req, res) => {
    try {
        const catergories = await Catergory.find({}, { name: true })
        if (!catergories.includes(req.body.catergory)) {
            return res.status(400).json({ message: 'Bad request' })
        }
        const { name, description, catergory, price, stockQty, sizes, gender } = req.body
        const product = await Product.create({
            name: name,
            description: description,
            catergory: catergory,
            price: price,
            sizes: sizes,
            stockQty: stockQty,
            gender: gender,
        })
        return res(201).json({ message: 'Product created sucessfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to add product an error occured' })
    }
}

const getProducts = async (req, res) => {
    try {
        const products = Product.find()
        if (!products) {
            return res.status(404).json({ message: 'No products found' })
        }
        return res.status(200).json({ message: products })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to get products    ' })
    }
}

const viewProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = Product.find({
            _id: productId
        })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        return res.status(200).json({ product: product })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to get product' })
    }
}


const editProduct = async (req, res) => {
    try {
        const catergories = await Catergory.find({}, { name: true })
        if (!catergories.includes(req.body.catergory)) {
            return res.status(400).json({ message: 'Bad request' })
        }
        const { productId, name, description, catergory, price, sizes, stockQty, gender } = req.body
        const product = await Product.findByIdAndUpdate(productId, {
            name: name,
            description: description,
            catergory: catergory,
            price: price,
            sizes: sizes,
            stockQty: stockQty,
            gender: gender,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to edit product an error occured' })
    }

}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const response = Product.findByIdAndDelete(productId)
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
    deleteProduct
}