import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.js";

export const analyticsRouter = Router();

analyticsRouter.get('',getAnalytics);

