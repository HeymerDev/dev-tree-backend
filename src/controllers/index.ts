import { Request, Response } from "express";
import formidable from "formidable";
import { v4 as uuid } from "uuid";

import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

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
};

export const login = async (req: Request, res: Response) => {
  // Implement login logic here
  const { email, password } = req.body;
  // Validate email existence
  const userExists = await User.findOne({ email });
  if (!userExists) {
    res.status(404).json({ message: "Invalid credentials" });
    return;
  }

  // Validate password
  const isValidPassword = await comparePassword(password, userExists.password);
  if (!isValidPassword) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = generateJWT({ id: userExists._id });

  res.status(200).json({ token });
};

export const getUser = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

export const updateUser = async (req: Request, res: Response) => {
  const slug = (await import("slug")).default;
  try {
    const { description, links } = req.body;
    const handle = slug(req.body.handle);
    const handleExists = await User.findOne({ handle });
    if (handleExists && handleExists.email !== req.user.email) {
      res.status(409).json({ message: "Handle already exists" });
      return;
    }

    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;
    req.user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    new Error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });

  try {
    form.parse(req, (err, fields, files) => {
      console.log(files.file[0].filepath);

      cloudinary.uploader.upload(
        files.file[0].filepath,
        {
          folder: "dev-tree",
          public_id: uuid(),
        },
        async function (error, result) {
          if (error) {
            const newError = new Error("Subida de imagen fallida");
            res.status(500).json({ message: "Internal server error" });
          }
          if (result) {
            req.user.imageUrl = result.secure_url;
            await req.user.save();
            res.status(200).json({
              imageUrl: result.secure_url,
              message: "Image uploaded successfully",
            });
          }
        }
      );
    });
  } catch (error) {
    new Error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
