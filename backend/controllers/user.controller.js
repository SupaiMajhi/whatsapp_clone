import jwt from "jsonwebtoken";

import { errorResponse, successfulResponse } from "../lib/lib.js";
import User from "../models/user.model.js";

export const getAllUsersHandler = async (req, res) => {
    const signinId = req.user._id;
    if(!signinId) return errorResponse(res, 400, 'unable to fetch. please try again');
    try {
        const users = await User.find({ _id: { $ne: signinId }}).select('-password')
        return successfulResponse(res, 200, 'successful', users);
    } catch (error) {
        console.log('getAllUsersHandler Error', error.message);
        return errorResponse(res, 500, 'Internal server error');
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
        return successfulResponse(res, 200, 'retrieve successfully.', response);
    } catch (error) {
        console.log('getAllUsersHandler Error', error.message);
        return errorResponse(res, 500, 'Internal server error');
    }
}

export const createUserHandler = async (req, res) => {
    const { auth_token:at } = req.cookie;
    if(!at) return errorResponse(res, 401, 'Unauthorized.');

    const { username, profilePic } = req.body.content;
    if(!username || !profilePic) return errorResponse(res, 400, 'All fields are required.');
    
    try {
        /** ------RETRIEVE PHONENUMBER FROM TOKEN------- */
        const { phoneNumber } = jwt.verify(vt, process.env.OTP_SECRET_KEY);
        if(!phoneNumber) return errorResponse(res, 401, 'Unauthorized.');

        /** ------CREATE A NEW USER------ */
        const newUser = new User({
            isVerified: true,
            phoneNumber,
            username,
            profilePic: profilePic || ''
        });
        await newUser.save();

        return successfulResponse(res, 201, 'User is created.', newUser);
    } catch (error) {
        console.log("Error in createUserHandler ", error.message);
        return errorResponse(res, 500, 'Internal server error.');
    }
}