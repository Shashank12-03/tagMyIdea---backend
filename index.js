import { connect } from "./connect.js";
import express from "express";
import passport from "passport";
import { userSignInRouter } from "./routes/userSignInRoute.js";
import { userRouter } from "./routes/userRouter.js";
import './config/auth.js';
import { checkAuthentication } from "./middleware/auth.js";
import { ideaRouter } from "./routes/ideaRoute.js";
import { errorLogRequests, logRequests } from "./middleware/log.js";
import cors from 'cors';
import { agenda } from "./services/agenda.js";
import { defineFeedBuilder } from "./jobs/feedBuilder.js";

if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
  console.log("Development mode: Environment variables loaded.");
}

const url = process.env.DATABASE_URL;

connect(url)
.then(()=>console.log("mongodb connected"))
.catch((err)=> console.log("error occured: \n",err));

const PORT = process.env.PORT;
const app = express();

const coreOption = {
    origin: ["http://localhost:5173", "https://tagmyidea.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    credentials: true, 
}

// middleware
app.use(cors(coreOption));
app.use(express.json());
app.use(passport.initialize());
app.use(logRequests);
app.use(errorLogRequests);

// routes
app.use('/auth',userSignInRouter);
app.use('/user',checkAuthentication,userRouter);
app.use('/idea',checkAuthentication,ideaRouter);

// Define jobs before starting agenda
defineFeedBuilder(agenda);

const start = async () => {
  try {
    console.log("Starting agenda...");
    await agenda.start();
    console.log("Agenda started successfully.");
    
    // Test job scheduling (optional - for debugging)
    // await agenda.schedule('in 10 seconds', 'build-user-feed', { userId: '507f1f77bcf86cd799439011' });
    
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
    
  } catch (error) {
    console.error("Error starting agenda:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await agenda.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await agenda.stop();
  process.exit(0);
});

start();