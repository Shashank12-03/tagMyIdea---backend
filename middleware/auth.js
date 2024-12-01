import { getUser } from "../services/auth.js";

export async function checkAuthentication(req,res,next) {
    const token = req.headers.authorization?.split(' ')[1];
    req.user = null;
    if (!token) {
        return res.status(401).json({'message':'token required'});
    }  
    const user = getUser(token);
    if (!user) {
        return res.status(401).json({'message':'user not found'})
    }
    req.user = user;
    next();
}

// export async function restrictTo(req,res,next) {
    
// }