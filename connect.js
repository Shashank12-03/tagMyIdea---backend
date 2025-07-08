import mongoose from "mongoose";


export async function connect(url) {
    return mongoose.connect(url);
}
