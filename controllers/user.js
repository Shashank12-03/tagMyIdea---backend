import { User } from "../models/user.js";
import { Ideas } from "../models/ideas.js";
import mongoose from "mongoose";
import { agenda } from "../services/agenda.js";
import { Feed } from "../models/feed.js";

export async function follow(req,res) {
    const {followId} = req.body;
    if (!followId) {
        return res.status(400).json({'message':'follow id required'});
    }
    try {
        
        const author = await req.user;
        const authorId = new mongoose.Types.ObjectId(author.id);

        if (!author || !author.id) {
            return res.status(400).json({'message':'author not found try login in!!!!'});
        }

        const followerID = new mongoose.Types.ObjectId(followId);


        const follower = await User.findByIdAndUpdate(followerID,{$addToSet:{followers:authorId}},{new:true});
        const following = await User.findByIdAndUpdate(authorId,{$addToSet:{following:followerID}},{new:true});

        if (!follower || !following) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({'message':'user added to follow list'});

    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong'});
    }
}
export async function unfollow(req,res) {
    const {unfollowId} = req.body;
    console.log(unfollowId);
    if (!unfollowId) {
        return res.status(400).json({'message':'unfollow id required'});
    }
    try {
        const author = await req.user;
        const authorId = new mongoose.Types.ObjectId(author.id);
        
        if (!author || !author.id) {
            return res.status(400).json({'message':'author not found try login in!!!!'});
        }
        
        const followerID = new mongoose.Types.ObjectId(unfollowId);
        
        console.log(authorId);
        console.log(followerID);
        
        const user = await User.findOne({_id:authorId,following:{$in:[unfollowId]}});
        
        if (!user) {
            return res.status(400).json({ message: "Follower is not in the following list." });
        }
        const follower = await User.findByIdAndUpdate(followerID,{$pull:{followers:authorId}});
        const following = await User.findByIdAndUpdate(authorId,{$pull:{following:followerID}});
        
        if (!follower || !following) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        return res.status(200).json({'message':'user removed from follow list'});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong'});
    }
}



export async function getUser(req,res) {
    const {userId} = req.params;
    console.log(userId);
    if (!userId) {
        return res.status(400).json({"message":"user id required"})
    }
    try {
        const user = await User.findById(userId).select("username photo bio followers following links dateJoined email");
        if (!user) {
            return res.status(404).json({"message":"user not found"});
        }
        return res.status(200).json({"user":user});
    } catch (error) {
        return res.status(500).json({"Error occured":error.message});
    }
}

export async function getLoggedUser(req,res) {
    const user = await req.user;
    const userId = user.id;
    if (!userId) {
        return res.status(400).json({"message":"user id required"})
    }
    try {
        const user = await User.findById(userId).select("username photo bio followers following links dateJoined email");
        
        // Schedule feed building job
        console.log(`Scheduling feed build job for user: ${userId}`);
        await agenda.schedule('in 1 minute', 'build-user-feed', { userId: userId });
        console.log(`Feed build job scheduled for user: ${userId}`);
        
        return res.status(200).json({"user":user});
    } catch (error) {
        console.error("Error in getLoggedUser:", error);
        return res.status(500).json({"Error occured":error.message});
    }
}

export async function triggerFeedBuild(req, res) {
    const user = await req.user;
    const userId = user.id;
    
    try {
        console.log(`Manually triggering feed build for user: ${userId}`);
        await agenda.now('build-user-feed', { userId: userId });
        console.log(`Feed build job triggered immediately for user: ${userId}`);
        
        return res.status(200).json({
            "message": "Feed build triggered successfully",
            "userId": userId
        });
    } catch (error) {
        console.error("Error triggering feed build:", error);
        return res.status(500).json({"Error occurred": error.message});
    }
}

export async function getList(req,res) {
    const {list} = req.query;
    // console.log(list);
    if (!list) {
        return res.status(400).json({"message":"no list found"});
    }
    let parsedList;
    try {
        parsedList = JSON.parse(list);
        const listToReturn = await User.find({_id:{$in:parsedList}}).select("id username photo");
        return res.status(200).json({"list":listToReturn});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"Error occured":error.message});
    }
}


export async function updateUser(req,res) {
    
    const {username,bio, links} = req.body;
    if (!username && !bio && !links){
        return res.status(400).json({'message':'need something to update'});
    }
    try {
        const userData = await req.user;
        const userId = userData.id;
        const user = await User.findByIdAndUpdate(userId, {
            username: username,
            bio: bio,
            links: links
        }, {new:true});
        // console.log(user);
        const data = {
            'id':user.id,
            'name': user.username,
            'bio':user.bio,
            'NoOffollowers':user.followers?.length,
            'NoOffollowing':user.following.length,
            'followers':user.followers,
            'following':user.following,
            'dateJoined': user.dateJoined,
            'links':user.links,
            'photo':user.photo,
        }
        return res.status(200).json({'user':data});
    } catch (error) {
        console.log(error);
        return res.status(500).json({'error':error.message});
    }
}

export async function search(req,res) {
    const {searchString} = req.query;
    console.log(searchString);
    if (!searchString) {
        return res.status(400).json({'message':'need something to search'});
    }
    try {
        const searchResult = {
            $or:[
                {username:{$regex:searchString,$options:'i'}}
            ]
        };
        const result = await User.find(searchResult);
        res.status(200).json({'search-result':result});
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong'});
    }
}

export async function deleteUser(req,res) {
    const user = await req.user;
    const userId = user.id;
    try {
        const userDelete = await User.findByIdAndDelete(userId);
        if (!userDelete) {
            return res.status(400).json({'message':'user not found'});
        }
        res.status(200).json({'deleted-user':userDelete});
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong'});
    }
}

export async function getIdeas(req,res) {
    const user = await req.user;
    try {
        const userId = user.id;
        const author = await User.findById(userId);
        const followingList = author.following;
        // we have to get the ideas of the users that the logged in user is following 
        // and ideas which are top rated and more viewed
        // const feed = await Ideas.find({author:{$in:followingList}}).limit(20).sort({createdAt:-1});
        // feed.sort((a,b) => new Date (a.createdAt)- new Date (b.createdAt));
        // const feed = await Ideas.aggregate([
        //     { $match: { 
        //             author: { $in: followingList },
        //             // createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
        //         }
        //     },
        //     { $sort: 
        //         { createdAt: -1 } 
        //     },
        //     { 
        //         $limit: 20 
        //     },
        //     {
        //         $lookup:{
        //             from:'user',
        //             localField:'author',
        //             foreignField:'_id',
        //             as:'author'
        //         }
        //     },
        //     {
        //         $project:{
        //             _id:1,
        //             title:1,
        //             description:1,
        //             tags:1,
        //             techStack:1,
        //             howToBuild:1,
        //             upvotes:1,
        //             createdAt:1,
        //             userId: author._id,
        //             username: author.username,
        //             photo: author.photo,
        //         }
        //     },
        // ]);
        const feed = await Feed.findOne({user:userId}).populate('ideas');
        console.log(feed);
        return res.status(200).json({'feed':feed,'number':feed.length});
    } catch (error) {
        console.log(error);
        return res.status(500).json({'message':error.message});
    }
}

// we have to also maintain the ideas which are already being viewed by the user
// so that we can show the user the ideas which are not viewed by him


export async function debugJobs(req, res) {
    try {
        const jobs = await agenda.jobs();
        const jobsInfo = jobs.map(job => ({
            name: job.attrs.name,
            data: job.attrs.data,
            nextRunAt: job.attrs.nextRunAt,
            lastRunAt: job.attrs.lastRunAt,
            lastFinishedAt: job.attrs.lastFinishedAt,
            failedAt: job.attrs.failedAt,
            failReason: job.attrs.failReason,
            result: job.attrs.result
        }));
        
        res.status(200).json({
            totalJobs: jobs.length,
            jobs: jobsInfo
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({"Error occurred": error.message});
    }
}

export async function testJob(req, res) {
    const user = await req.user;
    const userId = user.id;
    
    try {
        // Schedule a job to run immediately
        await agenda.now('build-user-feed', { userId: userId });
        
        res.status(200).json({
            "message": "Test job scheduled to run immediately",
            "userId": userId
        });
    } catch (error) {
        console.error("Error scheduling test job:", error);
        res.status(500).json({"Error occurred": error.message});
    }
}

export async function updatesaveIdeas(req,res) {
    const {ideaId,save} = req.body;
    if (!ideaId) {
        return res.status(400).json({'message':'idea id required'});
    }
    const user = await req.user;
    const userId = user.id;
    try {
        if (save) {
            const updateUser = await User.findByIdAndUpdate(userId,{$addToSet:{savedIdeas:ideaId}},{new:true});
            return res.status(200).json({'message':'idea saved'});
        }
        else{
            const updateUser = await User.findByIdAndUpdate(userId,{$pull:{savedIdeas:ideaId}});
            return res.status(200).json({'message':'idea removed from saved idea'});
        }
    } catch (error) {
        console.error("Error scheduling test job:", error);
        res.status(500).json({"Error occurred": error.message});
    }
}

export async function getSaveIdeas(req,res) {
    const user = await req.user;
    const userId = user.id;
    try {
        const savedIdeas = await User.findById(userId).populate('savedIdeas').select('savedIdeas');
        res.status(200).json({'saveIdeas':savedIdeas});
    } catch (error) {
        console.error("Error getting save ideas: ", error);
        res.status(500).json({"Error occurred": error.message});
    }
}

export async function getUserIdeas(req,res) {
    const {userId} = req.params;
    try {
        const userIdeas = await User.findById(userId).populate('ideasPosted').select('ideasPosted');
        res.status(200).json({'userIdeas':userIdeas});
    } catch (error) {
        console.error("Error getting user ideas: ", error);
        res.status(500).json({"Error occurred": error.message});
    }
}