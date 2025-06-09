import { Request, Response } from "express";

import User from "../models/User";
import { hashPassword } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {
    const slug = (await import("slug")).default;

    // Validate request body
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(409).json({ message: "Email already exists" });
        return;
    }

    const handle = slug(req.body.handle);
    const handleExists = await User.findOne({ handle });
    if (handleExists) {
        res.status(409).json({ message: "Handle already exists" });
        return;
    }

    const hash = await hashPassword(password);
    await User.create({ username, email, password: hash, handle });

    res.status(201).json({ message: "User created successfully" });
}