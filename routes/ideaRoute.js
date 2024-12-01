import express from "express";
import { createIdea,updateIdea,deleteIdea,searchIdea,upvoteIdea,downvoteIdea} from "../controllers/idea.js";

export const ideaRouter = express.Router();

ideaRouter.post('/create',createIdea);
ideaRouter.post('/update',updateIdea);
ideaRouter.delete('/delete',deleteIdea);
ideaRouter.get('/search/',searchIdea);
ideaRouter.post('/upvote',upvoteIdea);
ideaRouter.post('/downvote',downvoteIdea);
// 2. Idea
// - create  done
// - delete done
// - update
// - search by (tags, tech stack) done
// upvote 