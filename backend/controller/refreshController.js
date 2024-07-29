import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../utils/utils.js'

const refresh  = (req,res)=>{
    const refreshToken = req.cookies.jwt 
    if(!refreshToken){
        return res.status(401).json({message:'Unauthorised no token'})
    }
    jwt.verify(refreshToken,process.env.SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).json({message:'Forbidden token expired'})
        }
        const accessToken = generateAccessToken(decoded.userId,decoded.role)
        return res.status(200).json({accessToken:accessToken})
    })
}

export { refresh}