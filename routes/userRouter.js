import express from "express";
import {follow,unfollow,getUser,updateUser,search,deleteUser,getIdeas,getList,getLoggedUser,debugJobs,testJob,getSaveIdeas,updatesaveIdeas} from "../controllers/user.js";
export const userRouter = express.Router();

userRouter.post('/follow',follow);
userRouter.post('/unfollow',unfollow);
userRouter.get('/fetch-user/:userId',getUser);
userRouter.get('/fetch-logged-user',getLoggedUser);
userRouter.get('/fetch-list',getList);
userRouter.get('/search',search);
userRouter.get('/feed',getIdeas);
userRouter.delete('/delete',deleteUser);
userRouter.put('/update',updateUser);
userRouter.get('/debug-jobs',debugJobs);
userRouter.post('/test-jobs',testJob);
userRouter.put('/update-saved-ideas',updatesaveIdeas);
userRouter.get('/get-saved-ideas/:userId',getSaveIdeas);

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

