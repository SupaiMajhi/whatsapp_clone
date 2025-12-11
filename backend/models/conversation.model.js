import mongoose, { Schema, model } from "mongoose";

const conversationSchema = new Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, required: true}],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    lastMessagePreview: {
        content: { type: String },
        contentType: { type: String, enum: ["text", "image", "audio", "video", "gif"] },
        messageStatus: { type: String, enum: ["pending", "sent", "delivered", "seen"] }
    },
    unreadCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Conversation = model('Conversation', conversationSchema);

export default Conversation;