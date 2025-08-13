import { getUser } from "../services/auth.js";

export async function checkAuthentication(req,res,next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        req.user = null;
        if (!token) {
            return res.status(401).json({'message':'token required'});
        }  
        const user = await getUser(token);
        if (user==='expired') {
            console.log("Token expired");
            return res.status(401).json({'message':'token expired relogin'})
        }
        if (!user) {
            return res.status(401).json({'message':'invalid token'});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({'message':'Internal server error'});
    }
}

export async function restrictToNonAdmin(req,res,next) {
    try {
        const user = await req.user;
        if (!user.isAdmin) {
            return res.status(401).json({'message':'not admin'});
        }
        next();
    } catch (error) {
        return res.status(500).json({'message':'Internal server error'});
    }
}