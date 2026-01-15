import mongoose, { Schema, Document } from "mongoose";

export interface UserInterface extends Document {
  handle: string;
  username: string;
  email: string;
  password: string;
  description: string;
  imageUrl?: string;
  links: string
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
  description: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  links: {
    type: String,
    default: "[]"
  }
});

const User = mongoose.model<UserInterface>("User", userSchema);
export default User;
