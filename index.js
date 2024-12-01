import { connect } from "./connect.js";
import express from "express";
import passport from "passport";
import { userSignInRouter } from "./routes/userSignInRoute.js";
import { userRouter } from "./routes/userRouter.js";
import './config/auth.js';
import dotenv from 'dotenv';
import { checkAuthentication } from "./middleware/auth.js";
import { ideaRouter } from "./routes/ideaRoute.js";

dotenv.config();


connect("mongodb://127.0.0.1:27017/tagMyIdea")
.then(()=>console.log("mongodb connected"))
.catch((err)=> console.log("error occured: \n",err));


const PORT = process.env.PORT;
const app = express();


// middleware
app.use(express.json());
app.use(passport.initialize());
// app.use(checkAuthentication);

// routes

//user
app.use('/auth',userSignInRouter);
app.use('/user',checkAuthentication,userRouter);

// idea
app.use('/idea',checkAuthentication,ideaRouter);



app.listen(PORT,()=>console.log(`Server running on port:${PORT}`));
