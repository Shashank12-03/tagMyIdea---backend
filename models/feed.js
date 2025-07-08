import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ideas:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "Idea",
        required: true
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
});

export const Feed = mongoose.model("Feed", feedSchema);
