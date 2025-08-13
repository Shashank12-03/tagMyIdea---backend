import { Router } from "express";
import { getFeedStatus, testJob } from "../controllers/system.js";
const systemRouter = Router();

systemRouter.get('/debug-jobs',getFeedStatus);
systemRouter.post('/test-jobs',testJob);