import mongoose, { SchemaTypes } from "mongoose";

const CartSchema = new mongoose.Schema({
    user_id: { type: mongoose.SchemaTypes.ObjectId },
    items: { type: [mongoose.SchemaTypes.ObjectId], ref: ('Product') }
})

const Cart = mongoose.model('Cart', CartSchema)

export {
    Cart
}