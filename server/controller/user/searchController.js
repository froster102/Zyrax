import { Product } from "../../model/product.js"

const searchProducts = async (req, res) => {
    const { query } = req.query
    if (!query) {
        return res.status(400).json({ message: 'No query to search found in request' })
    }
    try {
        const products = await Product.find({
            $text: { $search: query }
        })
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to search products' })
    }
}

export {
    searchProducts
}