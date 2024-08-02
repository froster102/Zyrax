import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    sizes: { type: [String], default: [] },
    gender: { type: String, enum: ['male', 'female', 'Unisex'] },
    imageUrls: { type: [String], required: true },
    price: { type: Number, required: true },
    discount: {
        name: { type: String },
        percentage: { type: Number }
    },
    stockQty: { type: Number, required: true },
    catergory: { type: String, required: true },

})

const Product = mongoose.model('Product', ProductSchema)

export {
    Product
}