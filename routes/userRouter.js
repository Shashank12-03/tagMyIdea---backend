import express from "express";
import {follow,unfollow,getUser,updateUser,search,deleteUser,getIdeas,getLoggedInUser} from "../controllers/user.js";
export const userRouter = express.Router();

userRouter.post('/follow',follow);
userRouter.post('/unfollow',unfollow);
userRouter.get('/fetch-user/:id',getUser);
userRouter.get('/fetch-logged-in-user',getLoggedInUser);
userRouter.get('/search',search);
userRouter.get('/feed',getIdeas);
userRouter.delete('/delete',deleteUser);
userRouter.patch('/update',updateUser);
// # Operations

// User 
// - sign in apis done
// - follow post done
// - unfollow post done
// - account get done
// - feed (filter by most upvoted, recent) get done
// - delete account delete
// - update account post done
// - search user get done

