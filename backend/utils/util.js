import cookie from "cookie";
import jwt from "jsonwebtoken";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";

import User from "../models/user.model.js";

export const retrieveIdFromReq = async (req) => {
    try{
        const { auth_token } = cookie.parse(req?.headers?.cookie);
        if(!auth_token) return null;
        const isVerified = jwt.verify(auth_token, process.env.JWT_SECRET_KEY);
        if(!isVerified) return null;
        const user = await User.findOne({ phoneNumber: isVerified.phone });
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