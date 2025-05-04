import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conection = await mongoose.connect(process.env.MONGO_URI as string);
        const url = `${conection.connection.host}:${conection.connection.port}`;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1); // Exit the process with failure
    }
}