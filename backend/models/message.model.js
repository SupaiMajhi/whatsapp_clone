import mongoose, { Schema, model } from "mongoose";

export const messageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "audio", "gif"],
      default: "text",
    },
    content: { type: String },
    messageStatus: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    deliveredAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
