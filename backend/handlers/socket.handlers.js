import mongoose from "mongoose";

import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { sendViaSocket, sendBothViaSocket } from "../socket.js"
import { sendMsgHandler } from "../controllers/message.controller.js";


export const onDelivered = (data) => {
    if(Array.isArray(data.message_id)){
        try{
            data.message_id.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId.createFromHexString(msgId) },
                    { messageStatus: "delivered", deliveredAt: data.deliveredAt },
                    { returnDocument: "after" }
                );
                const conversation = await Conversation.findOneAndUpdate(
                    { _id: message.conversationId },
                    { $set: {
                        "lastMessage.messageStatus": message.messageStatus,
                        "lastMessage.deliveredAt": message.deliveredAt,
                    }},
                    { new: true }
                );
                
                //send ack back to sender
                sendViaSocket(message.sender.toString(), "delivered_ack", {
                    data: {
                        id: message.id,
                        conversationId: message.conversationId,
                        messageStatus: message.messageStatus,
                        deliveredAt: message.deliveredAt
                    }
                });
            });
        }catch(error){
            //todo: handle retry, i don't know how to achieve
            console.log('Error in onDelivered ', error);
        }   
    }
}

export const onRead = (data) => {
    if(Array.isArray(data.messagesIds)){
        try{
            data.messagesIds.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId.createFromHexString(msgId) }, 
                    { messageStatus:"read", readAt:Date.now() }, 
                    { returnDocument: "after" }
                );

                await Conversation.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId.createFromHexString(data.conversationId) },
                    { $set: {
                        "lastMessage.messageStatus": message.messageStatus,
                        "lastMessage.readAt": message.readAt,
                    }},
                    { returnDocument: "after" }
                );
                
                //send ack back to sender
                sendViaSocket(message.sender.toString(), "seen_ack", {
                  data: {
                    id: message.id,
                    conversationId: message.conversationId,
                    messageStatus: message.messageStatus,
                    readAt: message.readAt,
                  },
                });
            });
        }catch(error){
            //todo: handle retry, i don't know how to achieve
            console.log('Error in onRead', error);
        }   
    }
    return;
}

export const handle_new_message = async(sender, data) => {
    //validate message body on backend
    const response = await sendMsgHandler(sender, data);
    sendBothViaSocket(sender, response.newMsg.receiver, "new_message", {
        newMsg: response.newMsg,
        conversation: response.conversation,
    });   
}