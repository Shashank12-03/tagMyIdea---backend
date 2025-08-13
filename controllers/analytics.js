import { User } from "../models/user.js";
import { Ideas } from "../models/ideas.js";


export async function getAnalytics(req,res) {
    try {
        const numberOfActiveUser = await User.countDocuments();
        const numberOfIdeasShared = await Ideas.countDocuments();
        // console.log(numberOfActiveUser);
        return res.status(200).json({'activeUsers':numberOfActiveUser,'ideasShared':numberOfIdeasShared});
    } catch (error) {
        return res.status(500).json({'error occured':error.message});
    }
}