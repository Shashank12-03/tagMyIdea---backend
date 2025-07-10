import { Feed } from '../models/feed.js';
import { User } from '../models/user.js';
import { Ideas } from '../models/ideas.js';

export function defineFeedBuilder(agenda) {
  agenda.define('build-user-feed', async (job) => {
    const { userId } = job.attrs.data;
    console.log(`[FEED JOB] Starting feed build for user ${userId}...`);

    try {
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      console.log(`[FEED JOB] Found user: ${user.username}, following: ${user.following?.length || 0} users`);

      let ideas;
      if (user.following && user.following.length > 0) {
        console.log(`[FEED JOB] Finding ideas from following list...`);
        ideas = await Ideas.find({ author: { $in: user.following } }).sort({ upvotes: -1}).limit(50);
        console.log(`[FEED JOB] Found ${ideas.length} ideas from following`);
      } else {
        console.log(`[FEED JOB] No following users, getting popular ideas...`);
        ideas = await Ideas.find({}).sort({ upvotes: -1}).limit(50);
        console.log(`[FEED JOB] Found ${ideas.length} popular ideas`);
      }

      const feed = await Feed.findOneAndUpdate(
        { user: userId },
        {
          ideas: ideas.map(idea => idea._id),
          updatedAt: new Date(),
        },
        { new: true, upsert: true }
      );

      console.log(`[FEED JOB] Feed updated for ${userId} with ${feed.ideas.length} ideas.`);
      
      job.attrs.result = {
        success: true,
        ideasCount: feed.ideas.length,
        completedAt: new Date()
      };
      
    } catch (err) {
      console.error(`[FEED JOB] Error in feed job for ${userId}:`, err.message);
      console.error(`[FEED JOB] Stack trace:`, err.stack);
      
      job.attrs.result = {
        success: false,
        error: err.message,
        failedAt: new Date()
      };
      
      throw err; // Re-throw to mark job as failed
    }
  });

  agenda.on('ready', async () => {
    setInterval(async () => {
      try {
        const result = await agenda._collection.deleteMany({
          name: 'build-user-feed',
          lastFinishedAt: { $exists: true },
        });
        if (result.deleteCount > 0) {
          console.log(`[FEED JOB] Cleaned up ${result.deleteCount} completed feed jobs.`);
        }
      } catch (error) {
        console.error(`[FEED JOB] Error cleaning up completed job:`, error.message);
      }
    }, 60*60*1000);
  })
}