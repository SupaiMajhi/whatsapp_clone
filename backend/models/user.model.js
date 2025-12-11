import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
    },
    profilePic: {
      type: String,
      default: null,
    },
    lastSeen: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
