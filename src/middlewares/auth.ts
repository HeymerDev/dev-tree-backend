import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../models/User";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: UserInterface;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if(!bearer) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = bearer.split(" ")[1];

    if(!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(typeof decoded === "object" && decoded.id) {
            const user = await User.findById(decoded.id).select("-password");
            if(!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            req.user = user;
            next();
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}