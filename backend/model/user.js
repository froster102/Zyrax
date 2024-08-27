import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
}, { _id: false })

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        minlength: [3, 'Minimum of 3 character required'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'First name must only contain alphabets'
        }
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        minlength: [3, 'Minimum of 3 character required'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'Last name must only contain alphabets'
        }
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v),
            message: 'Enter a valid email'
        }
    },
    phoneNumber: {
        type: Number,
        trim: true,
        validate: {
            validator: (v) => v.toString().split('').length === 10,
            message: 'Enter a valid phone number'
        }
    },
    googleId: { type: String },
    authProvider: { type: String, enum: ['google'] },
    profilePic: { type: String },
    password: {
        type: String,
    },
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