import { connect } from "./connect.js";
import express from "express";
import passport from "passport";
import { userSignInRouter } from "./routes/userSignInRoute.js";
import { userRouter } from "./routes/userRouter.js";
import './config/auth.js';
import dotenv from 'dotenv';
import { checkAuthentication } from "./middleware/auth.js";
import { ideaRouter } from "./routes/ideaRoute.js";
import { errorLogRequests, logRequests } from "./middleware/log.js";
import cors from 'cors';


if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}

const url = process.env.DATABASE_URL;
connect(url)
.then(()=>console.log("mongodb connected"))
.catch((err)=> console.log("error occured: \n",err));


const PORT = process.env.PORT;
const app = express();

const coreOption = {
    origin:"http://localhost:5173",
    method:["GET","POST","PATCH","DELETE","PUT"],
    allowHeaders:["Content-Type","Authorization","Access-Control-Allow-Origin"],
    credentials: true, 
}

// middleware
app.use(cors(coreOption));
app.use(express.json());
app.use(passport.initialize());
app.use(logRequests);
app.use(errorLogRequests);

// routes

//user
app.use('/auth',userSignInRouter);
app.use('/user',checkAuthentication,userRouter);

// idea
app.use('/idea',checkAuthentication,ideaRouter);



app.listen(PORT,()=>console.log(`Server running on port:${PORT}`));


