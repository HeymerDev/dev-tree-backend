import { Request, Response } from "express";

import User from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
    try {
        await User.create(req.body)
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}