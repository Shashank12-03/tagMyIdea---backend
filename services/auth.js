import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export async function getUser(token) {
    try {
        if (!token) {
            return null;
        }
        const res = jwt.verify(token,secret);
        return res;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return 'expired';
        }
        return null;
    }
}