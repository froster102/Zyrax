import { User } from "../../model/user.js"

const getProfile = async (req, res) => {
    const { userId } = req
    try {
        const user = await User.findOne({ _id: userId }, { firstName: true, lastName: true, email: true, addresses: true, gender: true })
        if (user) return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

const updateProfile = async (req, res) => {
    const { userId } = req
    try {
        const { firstName, lastName, phoneNumber, gender } = req.body
        const user = await User.findByIdAndUpdate(userId, {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            gender: gender
        }, { new: true })
        if (user) return res.status(200).json({ message: 'Profile updated sucessfully' })
    } catch (error) {
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg })
        }
        return res.status(500).json({ message: 'Failed to update profile' })
    }
}

export {
    getProfile,
    updateProfile
}