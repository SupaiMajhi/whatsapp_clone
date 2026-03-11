import jwt from 'jsonwebtoken';
import fs from "fs/promises";

import { generateOtp, hash, deHash, isValidPhoneNumber, generateToken } from "../lib/lib.js";
import { customResponse } from "../utils/util.js";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import {uploadProfile} from "../services/cloudinary.js";
import { sendOTPtoPhoneNumber } from "../services/twilio.js";


export const getOtpHandler = async (req, res) => {
  //todo: implement a phone validation library with country code and change in sendToPhoneNumber method accordingly.
  const { phone } = req.body.content;
  if (!phone || !isValidPhoneNumber(phone))
    return customResponse(res, 400, {
      "error": {
        "message": "phone is not an of invalid type.",
      }
    });
  try {
    const isOtpExist = await Otp.findOne({ phoneNumber: phone });
    if(isOtpExist) return customResponse(res, 404, {
      "error": {
        "message": "OTP already exist.",
        "data": {
          "verificatiion_token": isOtpExist.verification_token,
          "redirect_url": "/auth/verify"
        }
      }
    });
    
    /** ----CREATE A TOKEN---- */
    const payload = {
      phone,
    };
    const token = jwt.sign(payload, process.env.OTP_SECRET_KEY);


    const otp = generateOtp();
    const hashedOtp = await hash(otp);

    /** ------CREATE AND SAVE OTP----- */
    const newOtp = new Otp({
      verification_token: token,
      phoneNumber: phone,
      otp: hashedOtp,
      otpExpiry: Date.now() + 1000 * 60 * 5,
    });

    const user = await User.findOne({ phoneNumber: phone });
    user.lastOtpSentAt = Date.now();
    user.resendCount = 1;

    await user.save();
    await newOtp.save();

    /** -----SEND OTP----- */
    // if (otp && isValidPhoneNumber(phone)) {
    //   await sendOTPtoPhoneNumber(otp, phone);
    // }

    res.cookie("verification_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
      secure: false,
      sameSite: "strict",
    });
    return customResponse(res, 200, {
      "message": "OTP sent successfully.",
      "data": {
        "verification_token": token,
        "redirect_url": "/auth/verify"
      }
    });
  } catch (error) {
    await Otp.deleteOne({phoneNumber:phone});
    if(error.name === "TokenExpiredError"){
      return customResponse(res, 500, {
        "error": {
          "message": "session expired.",
          "data": {
            "redirectURL": '/auth/authpage', 
            "verification_token": null  
          }
        }
      });
    }

    console.log("sendOtpHandler error", error.message);
    return customResponse(res, 500, {
        "message": `Internal server error ${error.message}`
      }
    );
  }
}

export const resendHandler = async (req, res) => {

  let crntTime = Date.now();
  let COOL_DOWN = 60 * 1000;
  let MAX_RESEND = 3;
  let phoneNumber;

  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer')) return customResponse(res, 401, 'Invalid token.');

  try {
    const vt = authHeader.split(' ')[1];
    
    /** --------EXTRACT PHONENUMBER FROM TOKEN------- */
    const payload = jwt.verify(vt, process.env.OTP_SECRET_KEY);
    phoneNumber = payload.phoneNumber;
    if(!phoneNumber || !isValidPhoneNumber(phoneNumber)) return customResponse(res, 401, 'Unauthorized.');

    /**------THERE MUST BE A OTP SHOULD EXIST TO RE-SEND ANOTHER OTP------ */
    const existDoc = await Otp.findOne({ verification_token: vt });
    if(!existDoc) return customResponse(res, 401, 'Unauthorized', {'redirectURL': '/auth/get_otp'});
    
    let timePassed = crntTime - new Date(existDoc.lastOtpSentAt).getTime();
    if(timePassed < COOL_DOWN) return customResponse(res, 401, `Please wait ${Math.ceil((COOL_DOWN - timePassed) / 1000)}s before requesting another OTP.`);

    if(existDoc.resendCount >= MAX_RESEND) return customResponse(res, 401, 'You have reached maximum limit. Please try again after sometimes.');

    /**-----REWRITE PREVIOUS ONE AND SEND A NEW ONE----- */
    const otp = generateOtp();
    const hashedOtp = await hash(otp);

    /**-----SAVE TO THE DB------ */
    existDoc.otp = hashedOtp;
    existDoc.otpExpiry = Date.now() + 5 * 60 * 1000;
    existDoc.lastOtpSentAt = Date.now();
    existDoc.resendCount = existDoc.resendCount + 1;
    await existDoc.save();

    if(phoneNumber && isValidPhoneNumber(phoneNumber)){
      sendOTPtoPhoneNumber(otp, phoneNumber);
    }

    return customResponse(res, 200, 'resent successfully.');
  } catch (error) {
    console.log('Error in resendHandler', error.message);
    return customResponse(res, 500, 'Internal server error.');
  }
}

//todo: if otp is incorrect there should be a try limit and rate limit to prevent attacks
export const verifyOtpHandler = async (req, res) => {
let now = Date.now();
  /**-----EXTRACT TOKEN FROM HEADER AND PARSE------ */
  const { verification_token:vt } = req.cookies;
  const { otp } = req.body.content;
  if(!otp || !vt) return customResponse(res, 400, {
    "error": {
      "message": "Token session expired.",
      "details": {
        "suggestion": "Please try after sometimes."
      }
    }
  }); //todo: maybe in future i would implement something to improve security instead of simple return.

  try {
    /** ----VERIFY THE TOKEN----- */
    const payload = jwt.verify(vt, process.env.OTP_SECRET_KEY);
 
    if(!payload.phone) return customResponse(res, 401, {
      "error": {
        "message": 'Invalid token'
      }
    }); //todo: if user's token has no phoneNumber or another phonenumber, i.e. malicious user. In that case:

    //todo: first invalidate this token

    /** ------QUERY OTP COLLECTION------ */
    const doc = await Otp.findOne({ phoneNumber: phone });
    if(!doc) return customResponse(res, 400, { 
      "error": {
        "message": 'Get an otp first.',
        "data": {
          "redirect_url": '/auth'
        }
      }
    });


    /**-----COMPARE THE PAYLOAD PHONE AND DATABASE PHONE------ */
    // const isSamePhoneNumber = await deHash(payload.phone, doc.phoneNumber);
    // if(!isSamePhoneNumber) return customResponse(res, 401, 'Unauthorized access.');


    if(now > doc.otpExpiry){
      //todo: otpExpiry time is already crossed, provide an option to re-send an otp
      await Otp.deleteMany({ phoneNumber: payload.phone });
      return customResponse(res, 401, {
        "error": {
          "message": 'OTP is expired.',
          "data": {
            "redirect_url": '/auth'
          }
        }
      }); 
    }

    const isSameOtp = await deHash(otp, doc.otp);
    if(!isSameOtp) return customResponse(res, 401, {
      "error": {
        "message": 'OTP is incorrect.'
      }
    });

    //if it is same otp
    await Otp.findOneAndDelete({ phoneNumber: payload.phone });

    /** ------RETURN A TOKEN------ */
    const token = await generateToken({phone: doc.phoneNumber});
    res.cookie("auth_token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });
    
    /** ------FIND THE USER IF NOT FOUND THEN CREATE A NEW USER----- */
    const user = await User.findOne({ phoneNumber: doc.phoneNumber });
    if(user) {
      user.isVerified = true;
      await user.save();

      return customResponse(res, 200, {
        "message": "Login successful.",
        "data": {
          "user": {
            "username": user.username, 
            "profilePic": user.profilePic,
          },
          "isVerified": true,
          "redirect_url": "/" 
        }
      });
    }

    return customResponse(res, 200, { 
      "message": "Login successful.",
      "data": {
        "redirectURL": '/auth/user/create',
        "isVerified": true 
      }
    });
        
  } catch (error) {
    /** -----IF ERROR IS TOKEN EXPIRED------  */
    if(error.name === 'TokenExpiredError'){
      return customResponse(res, 400, {
        "error": {
          "message": 'Session expired.',
          "data": {
            redirect_url:'/auth',
          }
        }
      });
    }

    console.log("verifyOtpHandler error ", error.message);
    return customResponse(res, 500, {
      "error": {
        "message": `Internal server error ${error.message}`
      }
    });
  }
};

export const checkAuthHandler = async (req, res) => {
  try {
    return customResponse(res, 200, {
      data: {
        user: req.user 
      }
    });
        
  } catch (error) {
    console.log("signupHandler error", error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`
      }
    });
  }
};

export const checkVTtokenHandler = async (req,res) => {
  const { verification_token:vt } = req.cookies;
  try {
    if(!vt){
      return customResponse(res, 400, {
        error: {
          message: 'Session Expired.'
        }
      });
    }
    
    /**------VERIFY THE TOKEN------- */
    const { phone } = jwt.verify(vt, process.env.OTP_SECRET_KEY);
    if(!phone) return customResponse(res, 400, {
      error: {
        message: 'Session Expired.'
      }
    });

    /**=====RETRIEVE OTP DOC WITH PHONE======= */
    const record = await Otp.findOne({ phoneNumber: phone });
    if(!record) return customResponse(res, 401, {
      error: {
        message: 'unauthorized.'
      }
    });


    return customResponse(res, 200, {
      message: 'Valid token',
      data: {
        verification_token: record.verification_token
      }
    });
  } catch (error) {
    if(error.name === "TokenExpiredError"){
      await Otp.deleteMany({ verification_token: vt});
      return customResponse(res, 400, {
        error: {
          message: 'Session Expired.',
          data: {
            redirect_url: '/auth'
          }
        }
      });
    }
    console.log('checkVTtokenHandler', error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`
      }
    });
  }
};

export const avatarUploadHandler = async (req, res) => {
  const id = req.user.id;
  const file = req.file;
  try {
      const response = await uploadProfile(file);
      if(!response){
        return customResponse(res, 400, 'Something went wrong, please try again');
      }
        //remove the file from the server
        await fs.unlink(file.path);
        
        const newDoc = await User.findByIdAndUpdate(
          id,
          { profilePic: response.url },
          { new: true }
        );
        return customResponse(
          res,
          200,
          "profile uploaded successfully.",
          newDoc.profilePic
        );
  } catch (error) {
    console.log("avatarUploadHandler error", error.message);
    return customResponse(res, 500, "Internal server error.");
  }
};

export const logoutHandler = async (req, res) => {
  try {
    res.cookie('token', '', {
      maxAge: 0
    });
    return customResponse(res, 200, 'Logout successfully.')
  } catch (error) {
    console.log(error.message);
    return customResponse(res, 500, 'Internal server error.');
  }
}