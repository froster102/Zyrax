import mongoose from "mongoose";
import { Product } from "./product.js";

const WishlistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'user_id is required']
    },
    items: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: ('Product'),
        validate: {
            validator: async (v) => {
                if (!Array.isArray(v)) return false
                const products = await Product.find({ _id: { $in: v } }).lean()
                const validIds = new Set(products.map(product => product._id.toString()))
                return v.every(id => validIds.has(id.toString()))
            },
            message: `Product with id not found`
        },
        default: []
    }
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema)

export {
    Wishlist
}