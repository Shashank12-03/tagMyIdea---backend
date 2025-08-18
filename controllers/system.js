import { Feed } from "../models/feed.js";
import { agenda } from "../services/agenda.js";

export async function getFeedStatus(req, res) {
    const user = await req.user;
    const userId = user.id;
    
    try {

        const activeJobs = await agenda.jobs({
            'name': 'build-user-feed',
            'data.userId': userId,
            'nextRunAt': { $exists: true },
            'lockedAt': { $exists: true }
        });
        
        console.log(`Active jobs for user ${userId}:`, activeJobs.length);
        const isBuilding = activeJobs.length > 0;
        
        const feed = await Feed.findOne({ user: userId }).populate('ideas');
        
        return res.status(200).json({
            "isBuilding": isBuilding,
            "feed": feed,
            "feedCount": feed ? feed.ideas.length : 0,
            "lastUpdated": feed ? feed.updatedAt : null
        });
    } catch (error) {
        console.error("Error checking feed status:", error);
        return res.status(500).json({"Error occurred": error.message});
    }
}

export async function testJob(req, res) {
    const user = await req.user;
    console.log("Test job initiated for user:", user);
    const userId = user.id;
    
    try {
        const feed = await Feed.findOne({user:userId});
        const now = new Date();
        if (feed && now - new Date(feed.updatedAt) < 3*60*60*1000) {
            return res.status(200).json({'message':`abhi to update kiya tha ${(now - new Date(feed.updatedAt))/1000}s pehle`});
        }

        await agenda.now('build-user-feed', { userId: userId });
        
        return res.status(200).json({
            "message": "Feed build started",
            "userId": userId,
            "status": "building"
        });
    } catch (error) {
        console.error("Error scheduling test job:", error);
        res.status(500).json({"Error occurred": error.message});
    }
}
