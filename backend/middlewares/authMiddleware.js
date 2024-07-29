import jwt from 'jsonwebtoken'

const userAuth = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization
    const accessToken = authHeader.split(' ')[1]
    jwt.verify(accessToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden token expired' })
        } else if (decoded.role !== 'user') {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        req.userId = decoded.userId
    })
    next()
}

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization
    const accessToken = authHeader.split(' ')[1]
    jwt.verify(accessToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden token expired' })
        } else if (decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        req.userId = decoded.userId
    })
    next()
}

export {
    userAuth,
    adminAuth
}