import { User } from '../../model/user.js'

const getAddresses = async (req, res) => {
    const addresses = await User.findById(req.userId, { addresses: true })
    return res.status(200).json(getAddresses)
}
