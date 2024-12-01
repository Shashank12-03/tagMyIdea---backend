import express from "express";
import passport from "passport";

export const userSignInRouter = express.Router();

userSignInRouter.get('/google',passport.authenticate('google',{scope:['profile','email']}));

userSignInRouter.get('/google/callback',
    passport.authenticate('google',{session:false}),
    (req,res)=>{
        res.json({token:req.user.token});
    }
);


