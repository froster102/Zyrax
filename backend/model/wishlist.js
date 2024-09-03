import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'user_id is required']
    },
    items: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: ('Product')
    }
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema)

export {
    Wishlist
}