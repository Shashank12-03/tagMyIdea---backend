import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export async function getUser(token) {
    if (!token) {
        return null;
    }
    return jwt.verify(token,secret);
}