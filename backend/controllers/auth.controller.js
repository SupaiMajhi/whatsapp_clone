import {
  errorResponse,
  generateOtp,
  successfulResponse,
  isValidPhoneNumber,
  hashedPassword,
  generateToken,
} from "../lib/lib.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import {uploadProfile} from "../cloudinary.js";
import fs from "fs/promises";

export const sendOtpHandler = async (req, res) => {
  const { phone } = req.body;
  if (!phone || !isValidPhoneNumber(phone))
    return errorResponse(res, 400, "Please provide valid phone number");
  try {
    const otp = generateOtp();
    const hashedOtp = bcrypt.hash(otp, 10);
    const newOtp = new Otp({
      phone,
      otp: hashedOtp,
      otpExpiry: Date.now() + 2 * 60 * 1000, //todo: make less than 30 seconds
    });
    await newOtp.save();
    //send otp
    return successfulResponse(res, 200, "sent successfully.");
  } catch (error) {
    console.log("getOtpHandler error", error.message);
    return errorResponse(res, 500, `Internal server error ${error.message}`);
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
    res.cookie("token", token, {
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
  const { phoneNumber, username, profilePic } = req.body;
  try {
    if (!phoneNumber || !username)
      return errorResponse(res, 400, "all fields are required.");
    const alreadyExist = await User.findOne({phoneNumber});
    if (alreadyExist) return errorResponse(res, 400, "phone already exist.");
    const newUser = new User({
      phoneNumber,
      username,
    });
    await newUser.save();
    return successfulResponse(res, 201, "created successfully.");
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