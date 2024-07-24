import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20'
import { User } from "../model/user.js";
import { config } from "dotenv";
config()

passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/user/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            console.log(profile)
            const user = await User.findOne({googleId:profile.id})
            if(!user){
                const user = await User.create({
                    firstName : profile.name.givenName,
                    lastName : profile.name.familyName,
                    email : profile.emails[0].value  ,
                    googleId : profile.id,
                    authProvider : 'google',
                    profilePic : profile.picture,
                    status : 'active'
                })
            }
            return cb(null, profile);
        } catch (err) {
            console.log(err)
            return cb(err, null);
        }
    }
));

export {
    passport
}       