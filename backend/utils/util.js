
import cookie from "cookie";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const sendViaSocket = (onlineUsers, id, msgType, content) => {
    const ws = onlineUsers.get(id);
    if(ws?.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
            type: msgType,
            content
        }))
    }
}

export const sendDualViaSocket = (onlineUsers, sender, receiver, msgType, content) => {
    const senderWS = onlineUsers.get(sender);
    const receiverWS = onlineUsers.get(receiver);
    if(senderWS?.readyState === WebSocket.OPEN){
        senderWS.send(JSON.stringify({
            type: msgType,
            content
        }))
    }

    if(receiverWS?.readyState === WebSocket.OPEN){
        senderWS.send(JSON.stringify({
            type: msgType,
            content
        }))
    }
}

export const retrieveIdFromReq = async (req) => {
    const { auth_token } = cookie.parse(req?.headers?.cookie);
    if(!auth_token) return null;
    const isVerified = jwt.verify(auth_token, process.env.JWT_SECRET_KEY);
    if(!isVerified) return null;
    const user = await User.findOne({ phoneNumber: isVerified.phone });
    if(!user) return null;
    return user.id;
}
