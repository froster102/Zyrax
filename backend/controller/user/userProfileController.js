import { User } from "../../model/user.js"

const getProfile = async (req, res) => {
    const { userId } = req
    try {
        const user = await User.findOne({ _id: userId }, { firstName: true, lastName: true, email: true, addresses: true })
        if (user) return res.status(200).json({ user })
    } catch (error) {
        console.log(error)
    }
}

export {
    getProfile
}