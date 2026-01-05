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