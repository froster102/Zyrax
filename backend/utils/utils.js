import jwt from 'jsonwebtoken'

const generateAccessToken = (user, role) => {
    return jwt.sign({
        'user': user,
        'role': role
    }, process.env.SECRET, { expiresIn: '1m' })
}

const generateRefreshToken = (user, role) => {
    return jwt.sign({
        'user': user,
        'role': role
    }, process.env.SECRET, { expiresIn: '1d' })
}

export {
    generateAccessToken,
    generateRefreshToken
}