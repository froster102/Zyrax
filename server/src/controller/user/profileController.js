import { User } from "../../model/user.js"

const getProfile = async (req, res) => {
    const { userId } = req
    try {
        const user = await User.findOne({ _id: userId }, { firstName: true, lastName: true, email: true, addresses: true, phoneNumber: true }).populate('addresses')
        if (user) return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:'Failed to get user profile'})
    }
}

const updateProfile = async (req, res) => {
    const { userId } = req
    try {
        const { firstName, lastName, phoneNumber } = req.body
        const user = await User.findByIdAndUpdate(userId, {
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            phoneNumber: String(phoneNumber),
        }, { new: true, runValidators: true })
        if (user) return res.status(200).json({ message: 'Profile updated sucessfully' })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const message = []
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to update profile' })
    }
}

export {
    getProfile,
    updateProfile
}