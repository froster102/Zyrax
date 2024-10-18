import { User } from '../../model/user.js'


const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: false })
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ message: 'Failed to get users an error occured' })
    }
}

const viewUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.find({
            _id: id
        }, { password: false })
        if (user) {
            return res.status(200).json({ user: user })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Failed to get user an error occured' })
    }
}

const blockUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndUpdate(id, { status: 'blocked' })
        return res.status(200).json({ message: 'User blocked sucessfully' })
    } catch (err) {
        return res.status(500).json({ message: 'Action failed an error has occured' })
    }
}

const unblockUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndUpdate(id, { status: 'active' })
        return res.status(200).json({ message: 'User unblocked sucessfully' })
    } catch (err) {
        return res.status(500).json({ message: 'Action failed an error has occured' })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const response = await User.findByIdAndDelete(id)
        if (!response) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ message: 'User deleted sucessfully' })
    } catch (err) {
        return res.status(500).json({ message: 'Action failed an error occured' })
    }
}

export {
    getUsers,
    viewUser,
    blockUser,
    unblockUser,
    deleteUser,
}