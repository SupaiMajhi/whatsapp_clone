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
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
        type: String,
        required: true
    },
    profilePic: {
      type: String,
      default: '', //todo: a link to a default avatar
    },
    lastSeen: {
      type: Date,
      default: Date.now(),
    },
    isProfileComplete: Boolean
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
