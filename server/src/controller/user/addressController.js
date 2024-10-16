import mongoose from 'mongoose'
import { Address } from '../../model/address.js'
import { User } from '../../model/user.js'

const addAddress = async (req, res) => {
    try {
        const { firstName = '', lastName = '', buildingName = '', street = '', city = '', state = '', pincode, phoneNumber } = req.body
        const existingAddress = await Address.findOne({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            buildingName: buildingName.toLowerCase(),
            street: street.toLowerCase(),
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            pincode,
            phoneNumber
        })
        if (existingAddress) return res.status(409).json({ message: 'Address already exists' })
        const address = await Address.create({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            buildingName: buildingName.toLowerCase(),
            street: street.toLowerCase(),
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            pincode,
            phoneNumber
        })
        const user = await User.findByIdAndUpdate(req.userId, { $addToSet: { addresses: address._id } }, { new: true, runValidators: true })
        if (user && address) return res.status(201).json({ message: 'Address added sucessfully' })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const message = []
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to add address' })
    }
}

const updateAddress = async (req, res) => {
    const { id } = req.params
    try {
        const { firstName = '', lastName = '', buildingName = '', street = '', city = '', state = '', pincode, phoneNumber } = req.body
        const address = await Address.findByIdAndUpdate(id, {
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            buildingName: buildingName.toLowerCase(),
            street: street.toLowerCase(),
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            pincode,
            phoneNumber
        }, { new: true, runValidators: true })
        if (address) return res.status(200).json({ message: 'Address updated sucessfully' })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const message = []
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg: message })
        }
        return res.status(500).json({ message: 'Failed to update address' })
    }
}

const deleteAddress = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid address ID' })
    }
    const address = await Address.findById(id)
    if (!address) return res.status(400).json({ message: 'Address with ID not found' })
    try {
        const response = await Address.findByIdAndDelete(id)
        const user = await User.findByIdAndUpdate(req.userId, {
            $pull: { addresses: id }
        }, { new: true })
        if (response && user) return res.status(200).json({ message: 'Address deleted sucessfully' })
    } catch (e) {
        return res.status(500).json({ message: 'Failed to delete address' })
    }
}

export {
    addAddress,
    updateAddress,
    deleteAddress
}
