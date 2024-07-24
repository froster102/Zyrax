import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
})

const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    googleId: { type: String },
    authProvider: { type: String },
    profilePic: { type: String },
    password: { type: String },
    status: { type: String, enum: ['active', 'blocked', 'deleted'] },
    addresses: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Address' }]
})

const User = mongoose.model('User', UserSchema)
const Address = mongoose.model('Address', AddressSchema)

export {
    User,
    Address
}