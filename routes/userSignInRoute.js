import express from "express";
import passport from "passport";

export const userSignInRouter = express.Router();

const frontend_url = "http://localhost:5173"


userSignInRouter.get('/google', 
    (req, res, next) => {
      passport.authenticate('google', {
        scope: ['profile', 'email']
      })(req, res, next);
    }
  );
  
  userSignInRouter.get('/google/callback', 
    (req, res, next) => {
      passport.authenticate('google', {
        session: false,
        failureRedirect: '/google'
      })(req, res, next);
    },
    (req, res) => {
      const token = req.user.token;
      const encodedToken = encodeURIComponent(token);
      console.log(encodedToken);
      res.redirect(`${frontend_url}/update/profile?token=${encodedToken}`);
      // return res.status(200).json({
      //   message: 'Authentication successful',
      //   token: token,
      //   user: req.user.user
      // });
    }
  );

