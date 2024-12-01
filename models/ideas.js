import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        enum: ["easy", "medium", "hard"],
    },
    techStack: { 
        type: [String], 
        required: true 
    },
    howToBuild: { 
        type: String, 
        required: true 
    },
    upvotes: { 
        type: Number, 
        default: 0 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}
,{});

export const Ideas = mongoose.model("Idea",ideaSchema);
