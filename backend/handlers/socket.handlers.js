
import Message from "../models/message.model.js";
import { onlineUsers } from "../socket.js";
import { sendViaSocket } from "../socket.js"


export const onDelivered = (data) => {
    if(Array.isArray(data)){
        try{
            data.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate({ id:msgId }, { messageStatus:"delivered", deliveredAt:Date.now() }, { returnDocument: "after" });
                
                //send ack to sender
                sendViaSocket(message.sender, "delivered_ack", {
                    data: {
                        _id: message.id,
                        conversationId: message.conversationId,
                        messageStatus: message.messageStatus,
                        deliveredAt: message.deliveredAt
                    }
                });
            });
        }catch(error){
            //handle retry, i don't know how to achieve
            console.log('Error in onDelivered ', error);
        }   
    }
    return;
}

export const onSeen = (data) => {
    if(Array.isArray(data)){
        try{
            data.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate({ id:msgId }, { messageStatus:"seen", seenAt:Date.now() }, { returnDocument: "after" });
                
                //send ack to sender
                sendViaSocket(message.sender, "seen_ack", { 
                    id:message.id,
                    conversationId: message.conversationId,
                    messageStatus: message.messageStatus,
                    seenAt: message.seenAt 
                });
            });
        }catch(error){
            //handle retry, i don't know how to achieve
            console.log('Error in handleDeliveryAck ', error);
        }   
    }
    return;
}