import mongoose from "mongoose";

import Message from "../models/message.model.js";
import { sendViaSocket } from "../socket.js"


export const onDelivered = (data) => {
    console.log(data)
    if(Array.isArray(data)){
        try{
            data.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate({ _id: mongoose.Types.ObjectId.createFromHexString(msgId) }, { messageStatus:"delivered", deliveredAt:Date.now() }, { returnDocument: "after" });
                
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

export const onSeen = (data) => {
    if(Array.isArray(data)){
        try{
            data.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate({ _id: mongoose.Types.ObjectId.createFromHexString(msgId) }, { messageStatus:"seen", seenAt:Date.now() }, { returnDocument: "after" });
                
                //send ack back to sender
                sendViaSocket(message.sender.toString(), "seen_ack", {
                  data: {
                    id: message.id,
                    conversationId: message.conversationId,
                    messageStatus: message.messageStatus,
                    seenAt: message.seenAt,
                  },
                });
            });
        }catch(error){
            //todo: handle retry, i don't know how to achieve
            console.log('Error in onSeen', error);
        }   
    }
    return;
}