
import Message from "../models/message.model.js";
import { onlineUsers } from "../socket.js";
import { sendViaSocket } from "../utils/util.js"


export const handleDeliveryAck = (data) => {
    if(Array.isArray(data)){
        try{
            data.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate({ id:msgId }, { messageStatus:"delivered", deliveredAt:Date.now() }, { returnDocument: "after" });
                
                //send ack to sender
                sendViaSocket(onlineUsers, message.sender, "delivered_ack", message);
            });
        }catch(error){
            //handle retry, i don't know how to achieve
            console.log('Error in handleDeliveryAck ', error);
        }   
    }
    return;
}

export const handleSeenAck = (data) => {
    if(Array.isArray(data)){
        try{
            data.forEach(async(msgId) => {
                const message = await Message.findOneAndUpdate({ id:msgId }, { messageStatus:"seen", seenAt:Date.now() }, { returnDocument: "after" });
                
                //send ack to sender
                sendViaSocket(onlineUsers, message.sender, "seen_ack", { id:message.id, seenAt:message.seenAt });
            });
        }catch(error){
            //handle retry, i don't know how to achieve
            console.log('Error in handleDeliveryAck ', error);
        }   
    }
    return;
}