import express from "express";
import router from "./router";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file
export const app = express();
connectDB(); // Connect to MongoDB

app.use(express.json());

app.use("/", router)
