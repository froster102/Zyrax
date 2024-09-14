import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20'
import { User } from "../model/user.js";
import { config } from "dotenv";
config()

passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const user = await User.findOne({ email: profile.emails[0].value })
            if (user) {
                await User.findOneAndUpdate({
                    email: user.email
                }, {
                    googleId: profile.id,
                    authProvider: 'google',
                    profilePic: profile.photos[0].value,
                    verification_status: true
                })
            }
            if (!user) {
                await User.create({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName || profile.name.givenName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    authProvider: 'google',
                    profilePic: profile.photos[0].value,
                    status: 'active',
                    verification_status: true,
                    createdAt: null
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