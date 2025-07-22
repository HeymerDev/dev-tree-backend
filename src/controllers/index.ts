import { Request, Response } from "express";

import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";

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

export const login = async (req: Request, res: Response) => {
    // Implement login logic here
    const { email, password } = req.body;
    // Validate email existence
    const userExists = await User.findOne({ email });
    if (!userExists) {
        res.status(404).json({ message: "Email not found" });
        return;
    }

    // Validate password
    const isValidPassword = await comparePassword(password, userExists.password);
    if (!isValidPassword) {
        res.status(401).json({ message: "Invalid password" });
        return;
    }

    res.send("Login successful");
}