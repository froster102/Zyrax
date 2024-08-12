import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
}, { _id: false })

const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    googleId: { type: String },
    authProvider: { type: String },
    profilePic: { type: String },
    password: { type: String },
    status: { type: String, enum: ['active', 'blocked', 'deleted'] },
    addresses: [addressSchema],
    verification_status: { type: Boolean },
    createdAt: {
        type: Date, default: Date.now(), index: {
            expires: '10m'
        }
    }
})

const User = mongoose.model('User', UserSchema)

export {
    User
}