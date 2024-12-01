import express from "express";
import {follow,unfollow,getUser,updateUser,search,deleteUser,getIdeas} from "../controllers/user.js";
export const userRouter = express.Router();

userRouter.post('/follow',follow);
userRouter.post('/unfollow',unfollow);
userRouter.get('/fetch-user',getUser);
userRouter.post('/update',updateUser);
userRouter.get('/search',search);
userRouter.delete('/delete',deleteUser);
userRouter.get('/feed',getIdeas);
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
