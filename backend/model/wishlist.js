import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.SchemaTypes.ObjectId },
    items: { type: [mongoose.SchemaTypes.ObjectId], ref: ('Product') }
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema)

export {
    Wishlist
}