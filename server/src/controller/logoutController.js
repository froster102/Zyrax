const logout = (req, res) => {
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ message: 'Unauthorised Access' })
    }
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true
    })
    return res.status(200).json({ message: 'Logged out sucessfully' })
}

export { logout }