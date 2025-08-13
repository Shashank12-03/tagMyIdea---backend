import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email :{
        type: String,
        required:true,
        unique:true
    },
    photo :{
        type:String
    },
    bio:{
        type: String 
    },
    username:{
        type: String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    dateJoined:{
        type:Date,
        default: Date.now
    },
    lastLogin:{
        type:Date,
        default: Date.now
    },
    lastUpdated:{
        type:Date,
        default: Date.now
    },
    followers:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    },
    following:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    },
    ideasPosted :{
        type: [mongoose.Schema.Types.ObjectId],
        ref :'Idea'
    },
    links:{
        type: [String],
        default:[]
    },
    savedIdeas:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Idea'
    },
},{timestamps:true});


export const User = mongoose.model("User",userSchema);