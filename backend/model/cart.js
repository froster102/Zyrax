import mongoose from "mongoose";

const CartItemSchema = {
    productId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
    selectedSize: { type: String },
    selectedQty: { type: Number }
}

const CartSchema = new mongoose.Schema({
    user_id: { type: mongoose.SchemaTypes.ObjectId },
    items: [CartItemSchema],
})

const Cart = mongoose.model('Cart', CartSchema)

export {
    Cart
}