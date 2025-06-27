import { Ideas } from "../models/ideas.js";
import { User } from "../models/user.js";


export async function createIdea(req,res) {
    const {title, description, tags, techStack, howToBuild} = req.body;
    if (title && description && tags && techStack && howToBuild){
        const author = await req.user;
        if (!author?.id){
            return res.status(400).json({'message':'author not found try login in!!!!'});
        }
        try {
            const userId = author.id;
            const idea = await Ideas.create({
                title, 
                description, 
                tags, 
                techStack, 
                howToBuild,
                author: userId
            });
            
            const user = await User.findByIdAndUpdate(userId,{$push:{ideasPosted:idea.id}},{new:true});
            
            return res.status(201).json({'user':user,'idea':idea});
            
        } catch (error) {
            console.log(error);
            return res.status(400).json({'message':'something went wrong!!!!'});
        }
    }
    
    return res.status(400).json({'message':'fields are missing!!!!'});
}


export async function searchIdea(req,res) {

    const { searchString } = req.query;
    if (!searchString) {
        return res.status(404).json({'message':'search string not found'});
    }
    
    try {
        
        const search = {
            $or:[
                {tags:{$in:[searchString]}},
                {techStack:{$in:[searchString]}},
            ]
        }
        
        const result = await Ideas.find(search);
        
        if (!result) {
            return res.status(404).json({'message':'nothing found for search'});
        }
        
        return res.status(200).json({'result':result});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong!!!!'});
    }
}


export async function deleteIdea(req,res) {
    const {ideaId} = req.body;

    if (!ideaId) {
        return res.status(400).json({'message':'need idea to delete!!!!'});
    }
    try {
        const user = await req.user;
        const userId = user.id;
        const author = await User.findById(userId).populate('ideasPosted');
        
        if (!author) {
            return res.status(400).json({'message':'user not found'});
        }
        
        const ideaExists = author.ideasPosted.some(
            (idea)=> idea._id.toString()===ideaId
        );
        
        if (!ideaExists) {
            return res.status(400).json({'message':'idea is not posted by logged in user'});
        }
        
        const idea = await Ideas.findByIdAndDelete(ideaId);
        await User.findByIdAndUpdate(userId,{$pull:{ideasPosted:ideaId}});
        
        if (!idea) {
            return res.status(400).json({'message':'cannot delete the idea it doesnt exist'});
        }
        
        console.log(idea);
        return res.status(200).json({'idea':idea});
    } 
    
    catch (error) {
        
        console.log(error);
        return res.status(400).json({'message':'something went wrong!!!!'});
        
    }
}
export async function updateIdea(req,res) {

    const fields = req.body;
    const para = req.params;
    const allowedFields = ['title','description','tags','techStack','howToBuild'];
    
    const validators = Object.keys(fields).every((field)=>allowedFields.includes(field));
    if (!validators) {
        return res.status(403).json({'message':'Invalid field(s) in the request.'})
    }
    try {
        const user = await req.user;
        const userId = user.id;
        const author = await User.findById(userId).populate('ideasPosted');
        
        if (!author) {
            return res.status(400).json({'message':'user not found'});
        }
        
        const ideaExists = author.ideasPosted.some(
            (idea)=> idea._id.toString()===para.id
        );
        if (!ideaExists) {
            return res.status(400).json({'message':'idea is not posted by logged in user'});
        }
        
        const idea = await Ideas.findByIdAndUpdate(para.id,{$set:fields},{new:true,runValidators:true});
        if (!idea) {
            return res.status(400).json({'message':'cannot delete the idea it doesnt exist'});
        }
        return res.status(200).json({'idea':idea});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong!!!!'});
    }
}

export async function upvoteIdea(req,res) {
    const {ideaId} = req.body;
    if (!ideaId) {
        return res.status(404).json({'message':'idea id not found'});
    }
    vote(ideaId,1,res);
}

export async function downvoteIdea(req,res) {
    const {ideaId} = req.body;
    if (!ideaId) {
        return res.status(404).json({'message':'idea id not found'});
    }
    const idea = await Ideas.findById(ideaId);
    if (idea.upvotes>0) {
        vote(ideaId,-1,res);
    }
    else{
        return res.status(400).json({'message':'idea upvotes are already very down cant have more downfall'});
    }
}

async function vote(ideaId,opr,res) {
    try {
        const idea = await Ideas.findByIdAndUpdate(ideaId,{$inc:{upvotes:opr}},{new:true});
        if (!idea) {
            return res.status(404).json({'message':'idea not found'});
        }
        
        return res.status(200).json({'idea':idea});
    } catch (error) {
        console.log(error);
        return res.status(400).json({'message':'something went wrong!!!!'});
    }
}

