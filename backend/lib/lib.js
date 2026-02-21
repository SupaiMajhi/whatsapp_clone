import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import cookie from "cookie";
import {fileTypeFromBuffer} from "file-type";
import {readChunk} from "read-chunk";



import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import { clients } from '../socket.js';

export const connectToDB = () => {
    mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('db connected'))
    .catch((e) => console.log(e.message))
}


export const customResponse = (res, code, message='', data={}) => {
    return res.status(code).json({ "message": message, "data": data });
}

export const isValidPhoneNumber = (phoneNumber) => {
    // Example regex for a 10-digit number, optionally with country code and separators
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber)
}

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

export const hash = async (value) => {
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(value.toString(), salt);
    return result;
}

export const deHash = async (value, hashValue) => {
    const result = await bcrypt.compare(value, hashValue);
    return result;
}

export const determineFileType = async (filePath) => {
    try {
        const buffer = await readChunk(filePath, { length: 4100 });
        const result = await fileTypeFromBuffer(buffer);
        return result.mime;
    } catch (error) {
        console.log("Error in determineFileType", error.message);
        return null;
    }
}

export const generateToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
}

export const retrieveIdFromReq = async (req) => {
    const { token } = cookie.parse(req.headers.cookie);
    if(!token) return null;
    const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!isVerified) return null;
    const user = await User.findOne({ phone: isVerified });
    if(!user) return null;
    return user.id;
}

export const sendMessageToSockets = (senderId, receiverId, msg) => {
    const senderSocket = clients.get(senderId.toHexString());
    const receiverSocket = clients.get(receiverId.toHexString());
    
    if(senderSocket && senderSocket.readyState === WebSocket.OPEN){
        senderSocket.send(JSON.stringify({
            type: 'NEW_MSG',
            content: {
                data: msg
            }
        }));
    }

    if(receiverSocket && receiverSocket.readyState === WebSocket.OPEN){
        receiverSocket.send(JSON.stringify({
            type: 'NEW_MSG',
            content: {
                data: msg
            }
        }));
    }
    return;
}

export const populateToAllUsers = (wClients, type, content, id) => {
    wClients.forEach((client) => {
        if (client.id !== id && client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                type,
                content,
                })
            );
        }
    })
}

export const getOfflineMessagesHandler = async (id) => {
    if(!id) return;
    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $and: [
                        {receiverId: mongoose.Types.ObjectId.createFromHexString(id)},
                        { isDelivered: false }
                    ]
                }
            },
            {
                $sort: {createdAt: -1}
            },
            {
                $group: {
                    _id: '$senderId',
                    //:problem is here its only sending the one message that is the first coming out after the sort
                    message: {$push: '$$ROOT'}
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'otherUser'
                }
            },
            {
                $unwind: '$otherUser'
            },
            {
                $project: {
                    message: 1,
                    'otherUser._id': 1,
                    'otherUser.username': 1,
                    'otherUser.profilePic': 1
                }
            }
        ]);
        return messages;
    } catch (error) {
        console.log("fetchUndeliveredMessages Error", error.message);
        return [];
    }
}