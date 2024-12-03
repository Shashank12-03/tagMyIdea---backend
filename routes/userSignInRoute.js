import express from "express";
import passport from "passport";

export const userSignInRouter = express.Router();

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
        failureRedirect: '/login'
      })(req, res, next);
    },
    (req, res) => {
      // Handle successful authentication
      res.redirect('/dashboard');
    }
  );

