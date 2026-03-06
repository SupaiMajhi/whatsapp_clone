import mongoose, { Schema, model } from "mongoose";

import { messageSchema } from "./message.model.js";

const conversationSchema = new Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, required: true}],
    lastMessage: messageSchema,
    unreadCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Conversation = model('Conversation', conversationSchema);

export default Conversation;