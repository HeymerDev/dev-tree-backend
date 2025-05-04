import mongoose, { Schema } from "mongoose";

interface UserInterface {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
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
