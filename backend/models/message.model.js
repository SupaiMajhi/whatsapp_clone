import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema(
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

    imageOrVideoUrl: { type: String },

    messageStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "seen"],
      default: "sent",
    },

    sentAt: { type: Date, default: Date.now() },

    deliveredAt: { type: Date },

    seenAt: { type: Date },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
