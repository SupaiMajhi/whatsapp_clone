import mongoose from "mongoose";
import { errorResponse, successfulResponse, sendMessageToSockets } from "../lib/lib.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { singleUpload } from "../services/cloudinary.js";
import { unlink } from "fs/promises";

export const sendMsgHandler = async (req, res) => {
    const sender = req.user._id;
    const receiver = req.params.receiverId;
    const textContent = req.body.content;
    const file = req.file;


    if(!sender || !receiver) return errorResponse(res, 400, 'sender or receiver are required.');

    if(!textContent && !file) return errorResponse(res, 400, 'Message cannot be empty.');


    let participants = [sender, receiver].sort();
    let contentType = 'text';
    let mediaUrl = null;

    try{
        if(file){
            //----Determaine Content Type-----
            if(file.mimetype.startsWith('image/')) contentType = 'image';
            else {
                return errorResponse(res, 400, 'Unsupported file type.');
            }

            //----Upload to Cloudinary----
            const uploadRes = await singleUpload(file.path);
            if(uploadRes){
                await unlink(file.path);
            }
            mediaUrl = uploadRes.secure_url;
        }

        //----Find or Create Conversation----
        let conversation = await Conversation.findOne({ participants: { $all: [sender, receiver]}});

        if(!conversation){
            conversation = new Conversation({
                participants,
            });
            await conversation.save();
        }

        //----Create a New Message----
        const newMsg = new Message({
            conversationId: conversation._id,
            sender,
            receiver,
            contentType,
            content: textContent,
            imageOrVideoUrl: contentType !== 'text' ? mediaUrl : '',
        });

        await newMsg.save();

        //----Update Conversation----
        conversation.lastMessage = newMsg._id;
        conversation.lastMessagePreview = {
            content: newMsg.content,            //i have doubt whether not to give image as content or not in lastMessagePreview
            contentType: newMsg.contentType,
            messageStatus: newMsg.messageStatus
        };

        await conversation.save();

        return successfulResponse(res, 200, 'message sent.');
    } catch (error) {
      console.log("sendMsgHandler Error", error.message);
      return errorResponse(res, 500, "Internal server error");
    }
}

export const deleteMsgHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const isDeleted = await Message.findByIdAndDelete(id);
        if(!isDeleted) return errorResponse(res, 400, 'unable to delete');
        return successfulResponse(res, 200, 'deleted successfully.', {_id: isDeleted._id}); //todo: make the ui like in the whatsapp for the successful deleted msg
    } catch (error) {
        console.log("deleteMsgHandler Error", error.message);
        return errorResponse(res, 500, "Internal server error");
    }
}

export const updateMsgHandler = async (req, res) => {
    const id  = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    const { content }  = req.body;

    if(!content || !id) return errorResponse(res, 400, 'Message cannot be empty.');

    try {
        const isUpadated = await Message.findByIdAndUpdate(id, { content }, { new: true });
        if(!isUpadated) return errorResponse(res, 400, 'unable to update');
        return successfulResponse(res, 200, 'updated successfully.', isUpadated);
    } catch (error) {
        console.log("updateMsgHandler Error", error.message);
        return errorResponse(res, 500, "Internal server error");
    }
}

export const getAllMsgHandler = async (req, res) => {
    const { convoId } = req.params;
    
    if(!convoId) return errorResponse(res, 400, 'something went wrong, please try again');

    try {
        const messages = await Message.find({ conversationId: convoId });
        return successfulResponse(res, 200, 'successfully.', messages);
    } catch (error) {
        console.log("getAllMsgHandler Error", error.message);
        return errorResponse(res, 500, "Internal server error");
    }
}

export const getChatListHandler = async (req, res) => {
    const id = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    if(!id) return errorResponse(res, 401, 'something went wrong, please try again');

    try {
        const chatList = await Conversation.aggregate([
            {
                $match: { 'participants': { $in: [id] }}
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    otherUserId: {
                        $first: {
                            $filter: {
                                input: '$participants',
                                as:'p',
                                cond: { $ne:['$$p', id]}
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'otherUserId',
                    foreignField: '_id',
                    as: 'otherUser'
                }
            },
            {
                $unwind: '$otherUser'
            },
            {
                $project: {
                    _id: 1,
                    'unreadCount': 1,
                    'lastMessage': 1,
                    'lastMessagePreview': 1,
                    'createdAt': 1,
                    'updatedAt': 1,
                    'otherUser._id': 1,
                    'otherUser.username': 1,
                    'otherUser.profilePic': 1
                }
            }
        ]);
        return successfulResponse(res, 200, 'success', chatList );
    } catch (error) {
        console.log("getChatListHandler Error", error.message);
        return errorResponse(res, 500, "Internal server error");
    }
}

export const getOfflineMessagesHandler = async (id) => {
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