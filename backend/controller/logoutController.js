const logout = (req, res) => {
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ message: 'Unauthorised Access' })
    }
    req.clearCookie('jwt', { httpOnly: true, secure: false })
    return res.status(200).json({ message: 'Logged out sucessfully' })
}

export {logout}