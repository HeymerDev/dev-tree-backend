import mongoose, { Schema, } from "mongoose";

interface UserInterface {
    handle: string;
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
    handle: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
    },
})

const User = mongoose.model<UserInterface>("User", userSchema);
export default User;
