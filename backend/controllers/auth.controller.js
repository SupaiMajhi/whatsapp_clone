import jwt from 'jsonwebtoken';
import fs from "fs/promises";
import bcrypt from "bcrypt";


import { errorResponse, generateOtp, hashOtp, deHashOtp, successfulResponse, isValidPhoneNumber, hashedPassword, generateToken } from "../lib/lib.js";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import {uploadProfile} from "../services/cloudinary.js";
import { sendOTPtoPhoneNumber } from "../services/twilio.js";

export const sendOtpHandler = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || !isValidPhoneNumber(phoneNumber))
    return errorResponse(res, 400, "Please provide valid phone number");
  try {
    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);


    /** ----SEND A TOKEN---- */
    const payload = {
      phoneNumber,
    };
    const token = jwt.sign(payload, process.env.OTP_SECRET_KEY, {
      expiresIn: "5m"
    });


    /** ------CREATE AND SAVE OTP----- */
    const newOtp = new Otp({
      verification_token: token,
      phoneNumber,
      otp: hashedOtp,
      otpExpiry: Date.now() + 2 * 60 * 1000, //todo: make less than 30 seconds
    });
    await newOtp.save();


    /** -----SEND OTP----- */
    if (otp && isValidPhoneNumber(phoneNumber)) {
      await sendOTPtoPhoneNumber(otp, phoneNumber);
    }

    //todo: if otp sending is failed, then delete the db write for OTP.
    return successfulResponse(res, 200, "sent successfully.", token);
  } catch (error) {
    console.log("getOtpHandler error", error.message);
    return errorResponse(res, 500, `Internal server error ${error.message}`);
  }
};


//todo: if otp is incorrect there should be a try limit and rate limit to prevent attacks
export const verifyOtpHandler = async (req, res) => {
  const { otp, verification_token:vt } = req.body.content;

  if(!otp || !vt) return; //todo: maybe in future i would implement something to improve security instead of simple return.

  /** ----VERIFY THE TOKEN----- */
  const { phoneNumber } = jwt.verify(vt, process.env.OTP_SECRET_KEY);
  if(!phoneNumber) return;

  /** ------QUERY OTP COLLECTION------ */
  const doc = await Otp.findOne({ phoneNumber });
  if(!doc) return;

  if(doc.otpExpiry > Date.now()){
    const isSame = await deHashOtp(otp, doc.otp);

    if(!isSame) return errorResponse(res, 401, 'OTP is incorrect.');

    await Otp.findOneAndDelete({ phoneNumber });
    /** ------FIND THE USER IF NOT FOUND THEN CREATE A NEW USER----- */
    const user = await User.findOne({ phoneNumber }).select("-password");
    if(!user) {
      //todo: we have to create a new user for that we have to ask the user for all the info. required to create a new user.
      return errorResponse(res, 401, 'User not found.', {isVerified:false, createNew: true});
    }
    const updatedUser = await User.findOneAndUpdate({ phoneNumber },{ isVerified: true }, {new: true}).select('-password');
    return successfulResponse(res, 200, 'login successful.', updatedUser);
  }else {
    //todo: otpExpiry time is already crossed, provide an option to re-send an otp
    await Otp.findOneAndDelete({ phoneNumber });
  }
};

export const loginHandler = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    if (!phoneNumber) return errorResponse(res, 400, "all fields are required");

    //check if user already exist or not
    const alreadyExist = await User.findOne({ phoneNumber });
    if (!alreadyExist) return errorResponse(res, 401, "phone or password is incorrect");
    // generate token and send it to the user
    const token = await generateToken(alreadyExist.phoneNumber);
    res.cookie("auth_token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    return successfulResponse(res, 200, "login successful.", alreadyExist);
  } catch (e) {
    console.log("loginHandler error", e.message);
    return errorResponse(res, 500, "Internal server error.");
  }
};

export const signupHandler = async (req, res) => {
  const { username, password, phoneNumber } = req.body;
  if(!username || !password || !phoneNumber) return errorResponse(res, 400, 'All fields are required.');
  try {
      //-----CHECK IF THE NUMBER EXIST-----
      const isExist = await User.findOne({ phoneNumber });
      if(isExist) return errorResponse(res, 400, 'User already exist.');

      //----Hash the Password----
      const hashed = await hashedPassword(password);

      //---Create a New User----
      const user = new User({
        username,
        phoneNumber,
        password: hashed
      });
      await user.save();
      return successfulResponse(res, 201, 'User created.');
  } catch (e) {
    console.log("signupHandler error", e.message);
    return errorResponse(res, 500, "Internal server error.");
  }
};

export const checkAuthHandler = async (req, res) => {
  try {
    return successfulResponse(res, 200, "user is authenticated.", req.user);
  } catch (error) {
    console.log("signupHandler error", error.message);
    return errorResponse(res, 500, "Internal server error.");
  }
};

export const avatarUploadHandler = async (req, res) => {
  const id = req.user.id;
  const file = req.file;
  try {
      const response = await uploadProfile(file);
      if(!response){
        return errorResponse(res, 400, 'Something went wrong, please try again');
      }
        //remove the file from the server
        await fs.unlink(file.path);
        
        const newDoc = await User.findByIdAndUpdate(
          id,
          { profilePic: response.url },
          { new: true }
        );
        return successfulResponse(
          res,
          200,
          "profile uploaded successfully.",
          newDoc.profilePic
        );
  } catch (error) {
    console.log("avatarUploadHandler error", error.message);
    return errorResponse(res, 500, "Internal server error.");
  }
};

export const logoutHandler = async (req, res) => {
  try {
    res.cookie('token', '', {
      maxAge: 0
    });
    return successfulResponse(res, 200, 'Logout successfully.')
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, 500, 'Internal server error.');
  }
}