import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


export const connectToDB = () => {
    mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('db connected'))
    .catch((e) => console.log(e.message))
}

export const isValidPhoneNumber = (phoneNumber) => {
    // Example regex for a 10-digit number, optionally with country code and separators
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber)
}

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

export const hash = async (value) => {
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(value.toString(), salt);
    return result;
}

export const deHash = async (value, hashValue) => {
    const result = await bcrypt.compare(value, hashValue);
    return result;
}

export const generateToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
}