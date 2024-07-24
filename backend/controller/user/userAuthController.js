
const googleSigninCallback = (req, res) => {
    res.send('sign success with google')
}

const facebookSigninCallback = (req, res) => {
    res.send('sign in success with facebook')
}

const xSigninCallback = (req, res) => {
    res.send('sign in sucess with X')
}

const signin = (req, res) => {

}

const signUp = (req, res) => {

}


export {
    googleSigninCallback,
    facebookSigninCallback,
    xSigninCallback,
    signin,
    signUp
}