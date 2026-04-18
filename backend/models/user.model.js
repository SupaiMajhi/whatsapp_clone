import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      required: true,
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
