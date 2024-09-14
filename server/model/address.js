import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must contain at least 3 characters'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'First name must only contain alphabets'
        }
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'Last name must only contain alphabets'
        }
    },
    buildingName: {
        type: String,
        trim: true,
        minLength: [3, 'Building name must be at least 3 character'],
        validate: {
            validator: v => /^[A-Za-z\s]+$/.test(v),
            message: 'Building name must contain only alphabets'
        },
        required: [true, 'Building name is required']
    },
    street: {
        type: String,
        trim: true,
        minLength: [3, 'Street must be at least 3 character'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'Street must contain only alphabets'
        },
        required: [true, 'Street is required']
    },
    city: {
        type: String,
        trim: true,
        minLength: [3, 'City must be at least 3 character'],
        required: [true, 'City is required'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'City must contain only alphabets'
        },
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        enum: {
            values: [
                "andhra pradesh",
                "arunachal pradesh",
                "assam",
                "bihar",
                "chhattisgarh",
                "goa",
                "gujarat",
                "haryana",
                "himachal pradesh",
                "jharkhand",
                "karnataka",
                "kerala",
                "madhya pradesh",
                "maharashtra",
                "manipur",
                "meghalaya",
                "mizoram",
                "nagaland",
                "odisha",
                "punjab",
                "rajasthan",
                "sikkim",
                "tamil nadu",
                "telangana",
                "tripura",
                "uttar pradesh",
                "uttarakhand",
                "west bengal",
                "andaman and nicobar islands",
                "chandigarh",
                "dadra and nagar haveli and daman and diu",
                "lakshadweep",
                "delhi",
                "puducherry",
                "ladakh",
                "jammu and kashmir"
            ],
            message: 'State not found'
        }
    },
    pincode: {
        type: String,
        trim: true,
        required: [true, 'Pincode is required'],
        validate: {
            validator: v => /^[1-9][0-9]{5}$/.test(v),
            message: 'Enter a valid pincode'
        }
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: (v) => /^(\+91[-\s]?)?[6789]\d{9}$/.test(v),
            message: 'Enter a valid phone number'
        }
    },
})

const Address = mongoose.model('Address', AddressSchema)

export { Address }