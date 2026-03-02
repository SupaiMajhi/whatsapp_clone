
import cookie from "cookie";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const sendViaSocket = (ws, msgType, content) => {
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
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
