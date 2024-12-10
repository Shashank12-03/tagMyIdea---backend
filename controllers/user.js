import { User } from "../models/user.js";
import { Ideas } from "../models/ideas.js";
import mongoose from "mongoose";

export async function follow(req,res) {
    const {followId} = req.body;
    if (!followId) {
        return res.status(400).json({'message':'follow id required'});
    }
    try {
        console.log(req.user);
        
        const author = await req.user;
        const authorId = new mongoose.Types.ObjectId(author.id);

        if (!author || !author.id) {
            return res.status(400).json({'message':'author not found try login in!!!!'});
        }

        const followerID = new mongoose.Types.ObjectId(followId);

        console.log(authorId);
        console.log(followerID);

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
    if (!userId) {
        return res.status(400).json({'message':'url query required'});
    }
    const isFollow = await isFollow(userId);
    const user = await getProfile(userId);
    return res.status(200).json(user,isFollow);
}

export async function getLoggedInUser(req,res) {
    const request = await req.user;
    const requestId = request.id;
    const user = await getProfile(requestId);
    if (!user) {
        return res.status(404).json({'message':'user not found'});
    }
    return res.status(200).json(user);
}

async function isFollow(userId) {
    const requester = await req.user;
    const requesterId = requester.id;
    const user = await User.findById(requesterId);
    const followingList = user.following; 
    if (followingList.includes(userId)) {
        return true;
    }
    return false;
}

async function getList(userId) {

    try {
        const user = await User.findById(userId);
        const followList = user.followers;
        const followingList = user.following;
        const lists = [];
        const followers = [];
        const following = [];
        for (let index = 0; index < followList.length; index++) {
            const follower = await User.findById(followList[index]);
            const toSend = {
                'id':followList[index],
                'photo':follower.photo,
                'name': follower.username
            };
            followers.push(toSend);
        }
        for (let index = 0; index < followingList.length; index++) {
            const following = await User.findById(followingList[index]);
            const toSend = {
                'photo':following.photo,
                'id':followingList[index],
                'name': following.username,
            };
            following.push(toSend);
        }
        lists.push(followers);
        lists.push(following);
        return lists;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export async function getProfile(userId) {

    try {
        const user = await User.findById(userId);
        const list = await getList(userId);
        const toShow = {
            'id':userId,
            'name': user.username,
            'photo':user.photo,
            'bio':user.bio,
            'ideasPosted': user.ideasPosted,
            'NoOffollowers':user.followers.length,
            'NoOffollowing':user.following.length,
            'followers':list[0],
            'following':list[1],
            'dateJoined': user.dateJoined,
        };
        if (!user) {
            return undefined;
        }
        return toShow;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export async function updateUser(req,res) {
    
    const {username,bio} = req.body;
    if (!username && !bio){
        return res.status(400).json({'message':'need something to update'});
    }
    try {
        const getUser = await req.user;
        console.log(getUser);
        var user;
        if (username && !bio) {
            user = await User.findByIdAndUpdate(getUser.id,{username},{new:true,runValidators:true});
        }
        else if (!username && bio) {
            user = await User.findByIdAndUpdate(getUser.id,{bio},{new:true,runValidators:true});
        }
        else {
            user = await User.findByIdAndUpdate(getUser.id,{username,bio},{new:true,runValidators:true});
        }
        const data = {
            'id':user.id,
            'name': user.username,
            'bio':user.bio,
            'NoOffollowers':user.followers.length,
            'NoOffollowing':user.following.length,
            'followers':user.followers,
            'following':user.following,
            'dateJoined': user.dateJoined,
        }
        return res.status(200).json({'user':data});
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong'});
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
        const feed = await Ideas.find({author:{$in:followingList}}).limit(20).sort({createdAt:-1});
        // feed.sort((a,b) => new Date (a.createdAt)- new Date (b.createdAt));
        console.log(feed);
        return res.status(200).json({'feed':feed,'number':feed.length});
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong'});
    }
}