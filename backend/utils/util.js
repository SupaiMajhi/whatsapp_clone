import cookie from "cookie";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { ObjectId } from "mongodb";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";

import User from "../models/user.model.js";

export const retrieveIdFromReq = async (req) => {
    try{
        const { auth_token } = cookie.parse(req?.headers?.cookie);
        if(!auth_token) return null;
        const isVerified = jwt.verify(auth_token, process.env.JWT_SECRET_KEY);
        if(!isVerified) return null;
        const user = await User.findOne({ phone: isVerified.phone }).select("_id");
        if(!user) return null;
        return user.id;
    } catch(err){
        console.log('Error in retrieveIdFromReq', err.message);
        return null;
    }
}

export const customResponse = (res, code, data) => {
    return res.status(code).json({...data});
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

export const validatePhoneNumber = (phone, countryCode) => {
    return isValidPhoneNumber(phone, countryCode);
}

export const generateOtp = () => {
    return crypto.randomInt(100000, 1000000);
}

export const encodeCursor = (payload) => {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export const decodeCursor = (cursor) => {
    const payload = JSON.parse(Buffer.from(cursor, "base64url").toString("utf-8"));
    return { 
        createdAt: new Date(payload.createdAt),
        _id: new ObjectId(payload._id),
    }
}