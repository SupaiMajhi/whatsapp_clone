import jwt from "jsonwebtoken";

import { customResponse } from "../lib/lib.js";
import User from "../models/user.model.js";

export const getAllUsersHandler = async (req, res) => {
    const signinId = req.user._id;
    if(!signinId) return customResponse(res, 400, 'unable to fetch. please try again');
    try {
        const users = await User.find({ _id: { $ne: signinId }}).select('-password')
        return customResponse(res, 200, 'successful', users);
    } catch (error) {
        console.log('getAllUsersHandler Error', error.message);
        return customResponse(res, 500, 'Internal server error');
    }
}

export const setUserStatus = async (id) => {
    try {
        const res = await User.findByIdAndUpdate(id, { isOnline: true }, { new:true });
        console.log(res);
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
    if(!at) return customResponse(res, 401, 'Unauthorized.');

    const { username, profilePic } = req.body.content;
    console.log(username, profilePic)
    if(!username && !profilePic) return customResponse(res, 400, 'All fields are required.');
    
    try {
        /** ------RETRIEVE PHONENUMBER FROM TOKEN------- */
        const {phone} = jwt.verify(at, process.env.JWT_SECRET_KEY);
        if(!phone) return customResponse(res, 401, 'Unauthorized.');

        /**------CHECK IF ALREADY USER EXIST WITH SAME NUMBER------- */
        const isAlreadyExist = await User.findOne({ phoneNumber: phone });
        if(isAlreadyExist){
            isAlreadyExist.isVerified = true;
            await isAlreadyExist.save();
            return customResponse(res, 200, 'User is verified.', { "redirectURL": "/dashboard", "user": isAlreadyExist });
        }
        /** ------CREATE A NEW USER------ */
        const newUser = new User({
            isVerified: true,
            phoneNumber:phone,
            username,
            profilePic: profilePic || ''
        });
        await newUser.save();

        return customResponse(res, 201, 'User is created.', { "redirectURL": '/dashboard', "user": newUser });
    } catch (error) {
        console.log("Error in createUserHandler ", error.message);
        return customResponse(res, 500, 'Internal server error.');
    }
}