import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { customResponse } from "../utils/util.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getAllUsersHandler = async (req, res) => {
    const signinId = req.user._id;
    if(!signinId) return customResponse(res, 400, {
        "error": {
            "message": 'unauthorized'
        }
    });
    try {
        const users = await User.find({ _id: { $ne: signinId }});
        return customResponse(res, 200, {
            message: "users retrieved",
            data: {
                users
            }
        });
    } catch (error) {
        console.log('getAllUsersHandler Error', error.message);
        return customResponse(res, 500, {
            error: {
                message: `Internal server error ${error.message}`
            }
        });
    }
}

export const setUserStatus = async (id) => {
    try {
        const res = await User.findByIdAndUpdate(id, { isOnline: true }, { new:true });
        return res.isOnline;
    } catch (error) {
        console.log("setUserStatus error", error.message);
        return;
    }
}

export const getUserStatus = async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await User.findById(userId).select('isOnline').select('lastSeen');
        return customResponse(res, 200, 'retrieve successfully.', response);
    } catch (error) {
        console.log('getAllUsersHandler Error', error.message);
        return customResponse(res, 500, 'Internal server error');
    }
}

export const createUserHandler = async (req, res) => {
    const { auth_token:at } = req.cookies;
    if(!at) return customResponse(res, 401, {
        error: {
            message: 'Unauthorized.'
        }
    });

    const { username, profilePic } = req.body.content;
    if(!username && !profilePic) return customResponse(res, 400, {
        error: {
            message: 'All fields are required.'
        }
    });
    
    try {
        /** ------RETRIEVE PHONENUMBER FROM TOKEN------- */
        const {phone} = jwt.verify(at, process.env.JWT_SECRET_KEY);
        if(!phone) return customResponse(res, 401, {
            error: {
                message: 'Unauthorized.'
            }
        });

        /**------CHECK IF ALREADY USER EXIST WITH SAME NUMBER------- */
        const isAlreadyExist = await User.findOne({ phoneNumber: phone });
        if(isAlreadyExist){
            return customResponse(res, 403, { 
                error: {
                    message: "User already exist."
                }     
            });
        }
        /** ------CREATE A NEW USER------ */
        const newUser = new User({
            isVerified: true,
            phoneNumber:phone,
            username,
            profilePic: profilePic || ''
        });
        await newUser.save();

        return customResponse(res, 201, { 
            message: 'user created.',
            data: {
                redirect_url: '/dashboard', 
                user: newUser 
            }
        });        
    } catch (error) {
        console.log("Error in createUserHandler ", error.message);
        return customResponse(res, 500, {
            error: {
                message: `Internal server error ${error.message}`
            }
        });
    }
}

export const getChatListHandler = async (req, res) => {
    
    const id = mongoose.Types.ObjectId.createFromHexString(req.user.id);
    if(!id) return customResponse(res, 400, {
        error: {
            message: "Can't retrieve chatlist."
        }
    });

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
        return customResponse(res, 200, {
            message: "chatlist retrieved",
            data: {
                chatList
            }
        });
    } catch (error) {
        console.log("getChatListHandler Error", error.message);
        return customResponse(res, 500, {
            error: {
                message: `Internal server error ${error.message}`
            }
        });
    }
}