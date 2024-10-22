const logout = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV !== 'development' ? 'None' : '',
        secure: process.env.NODE_ENV === 'development' ? false : true
    })
    return res.status(200).json({ message: 'Logged out sucessfully' })
}

export { logout }