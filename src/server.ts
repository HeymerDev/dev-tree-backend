import express from "express";
import cors from "cors";
import router from "./router";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import { corsConfig } from "./config/cors";

dotenv.config(); // Load environment variables from .env file
export const app = express();

app.use(cors(corsConfig))
connectDB(); // Connect to MongoDB

app.use(express.json());

app.use("/", router)
