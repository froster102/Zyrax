import { User } from '../../model/user.js'


const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({ users: users })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to get users an error occured' })
    }
}

const viewUser = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.find({
            _id: userId
        })
        if (user) {
            return res.status(200).json({ user: user })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to get user an error occured' })
    }
}

const blockUser = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.findByIdAndUpdate(userId, { status: 'blocked' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Action failed an error has occured' })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body
        const response = await User.findByIdAndDelete(userId)
        if (!response) {
           return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ message: 'User deleted sucessfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Action failed an error occured' })
    }
}

export {
    getUsers,
    viewUser,
    blockUser,
    deleteUser,
}