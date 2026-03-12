import mongoose from "mongoose";
import { unlink } from "fs/promises";

import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import { customResponse } from "../utils/util.js";
import { sendViaSocket } from "../socket.js";
import { singleUpload } from "../services/cloudinary.js";

export const sendMsgHandler = async (req, res) => {
    const sender = req.user.id;
    const receiver = req.params.receiverId;
    const {textContent} = req.body.content;
    const file = req?.file;


    if(!sender || !receiver) return customResponse(res, 400, {
        "error": {
            "message": 'participants are required.'
        }
    });

    if(!textContent && !file) return customResponse(res, 400, {
        "error": {
            "message": 'Message cannot be empty.'
        }
    });


    let participants = [sender, receiver].sort();
    let contentType = 'text';
    let mediaUrl = null;

    try{
        if(file){
            //----Determaine Content Type-----
            if(file.mimetype.startsWith('image/')) contentType = 'image';
            else {
                return customResponse(res, 400, {
                    "error": {
                        "message": 'Unsupported file type.'
                    }
                });
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

        //-------get user------
        const user = await User.findOne({ _id: sender });

        //----Update Conversation----
        conversation.unreadCount += 1;
        conversation.lastMessage = newMsg;
        conversation.otherUser = {
            _id: user.id,
            username: user.username,
            profilePic: user.profilePic
        }
        await conversation.save();

        //-----send in real-time------
        sendViaSocket(receiver, 'new_msg', {
            data: {
                newMsg,
                conversation,
            }
        });
        return customResponse(res, 200, {
            "message": 'message sent.',
            "data": {
                newMsg
            }
        });
    } catch (error) {
      console.log("sendMsgHandler Error", error.message);
      return customResponse(res, 500, {
        "error": {
          "message": `Internal server error ${error.message}`,
        },
      });
    }
}

export const deleteMsgHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const isDeleted = await Message.findByIdAndDelete(id);
        if(!isDeleted) return customResponse(res, 400, 'unable to delete');
        return customResponse(res, 200, 'deleted successfully.', {_id: isDeleted._id}); //todo: make the ui like in the whatsapp for the successful deleted msg
    } catch (error) {
        console.log("deleteMsgHandler Error", error.message);
        return customResponse(res, 500, "Internal server error");
    }
}

export const updateMsgHandler = async (req, res) => {
    const id  = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    const { content }  = req.body;

    if(!content || !id) return customResponse(res, 400, 'Message cannot be empty.');

    try {
        const isUpadated = await Message.findByIdAndUpdate(id, { content }, { new: true });
        if(!isUpadated) return customResponse(res, 400, 'unable to update');
        return customResponse(res, 200, 'updated successfully.', isUpadated);
    } catch (error) {
        console.log("updateMsgHandler Error", error.message);
        return customResponse(res, 500, "Internal server error");
    }
}

export const getAllMsgHandler = async (req, res) => {
    const { convoId } = req.params;
    
    if(!convoId) return customResponse(res, 400, {
        error: {
            message: 'Invalid conversation id'
        }
    });

    try {
        const messages = await Message.find({ conversationId: convoId });
        return customResponse(res, 200, {
            data: {
                messages
            }
        });
    } catch (error) {
        console.log("getAllMsgHandler Error", error.message);
        return customResponse(res, 500, {
            error: {
                message: `Internal server error ${error.message}`
            }
        });
    }
}

export const getOfflineMessages = async (value) => {
    const id = mongoose.Types.ObjectId.createFromHexString(value);
    if(!id) return;

    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    receiver: id,
                    messageStatus: "sent"
                }
            },
            {
                $sort: {createdAt: 1}
            },
            {
                $group: {
                    _id: '$conversationId',
                    messages: {
                        $push: '$$ROOT'
                    }
                }
            },{
                $lookup: {
                    from: "conversations",
                    localField: "_id",
                    foreignField: "_id",
                    as: "conversationObj"
                }
            },{
                $unwind: "$conversationObj"
            },{
                $addFields: {
                    otherUserId: {
                        $first: {
                            $filter: {
                                input: "$conversationObj.participants",
                                as: "p",
                                cond: { $ne: ["$$p", id] }
                            }
                        }
                    }
                }
            },{
                $lookup: {
                    from: "users",
                    localField: "otherUserId",
                    foreignField: "_id",
                    as: "otherUser"
                }
            },{
                $unwind: "$otherUser"
            },{
                $project: {
                    _id: 1,
                    'messages': 1,
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

// export const devGetOfflineMessages = async (req, res) => {
//     const id = mongoose.Types.ObjectId.createFromHexString(req.user.id);
//     if(!id) return customResponse(res, 400, 'no id');
//     try {
//         const messages = await Message.aggregate([
//             {
//                 $match: {
//                     receiver: id,
//                     messageStatus: "sent"
//                 }
//             },
//             {
//                 $sort: {createdAt: 1}
//             },
//             {
//                 $group: {
//                     _id: '$conversationId',
//                     messages: {
//                         $push: '$$ROOT'
//                     }
//                 }
//             },{
//                 $lookup: {
//                     from: "conversations",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "conversationObj"
//                 }
//             },{
//                 $unwind: "$conversationObj"
//             },{
//                 $addFields: {
//                     otherUserId: {
//                         $first: {
//                             $filter: {
//                                 input: "$conversationObj.participants",
//                                 as: "p",
//                                 cond: { $ne: ["$$p", id] }
//                             }
//                         }
//                     }
//                 }
//             },{
//                 $lookup: {
//                     from: "users",
//                     localField: "otherUserId",
//                     foreignField: "_id",
//                     as: "otherUser"
//                 }
//             },{
//                 $unwind: "$otherUser"
//             },{
//                 $project: {
//                     _id: 1,
//                     'messages': 1,
//                     'otherUser._id': 1,
//                     'otherUser.username': 1,
//                     'otherUser.profilePic': 1
//                 }
//             }
//         ]);
//         return customResponse(res, 200, 'success', messages);
//     } catch (error) {
//         console.log("fetchUndeliveredMessages Error", error.message);
//         return customResponse(res, 500, 'internal server error', []);
//     }
// }