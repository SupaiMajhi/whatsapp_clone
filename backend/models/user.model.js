import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    auth_token: {
      type: String,
      requried: true,
    },
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    dialCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    username: String,
    about: String,
    profilePic: {
      type: String,
      default: '', //todo: a link to a default avatar
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isProfileComplete: Boolean
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
