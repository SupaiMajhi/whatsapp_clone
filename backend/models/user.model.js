import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    isVerified: {
      type: Boolean,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
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
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
