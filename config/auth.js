import jwt from 'jsonwebtoken';
import passport from 'passport';
import { User } from '../models/user.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const clientID=process.env.client_id;
const clientSecret=process.env.client_secret;

// console.log(clientID, " ", clientSecret);

passport.use(new GoogleStrategy({
    clientID:clientID,
    clientSecret:clientSecret,
    callbackURL:'https://tag-my-idea.vercel.app/auth/google/callback'
    },
    async (accessToken,refreshTokenn,profile,done) => {
        try {
            console.log(profile);
            let user = await User.findOne({googleId:profile.id});
            console.log(user);
            if (!user) {
                user = new User({
                    googleId:profile.id,
                    email:profile.emails[0].value,
                    username:profile.displayName
                });
                await user.save();
            }

            const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'7h'});
            console.log(token);
            done(null,{user,token});
        } catch (error) {
            done(error,false);
        }
    }
));

