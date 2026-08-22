import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('db connected');
    } catch (error) {
        console.log('db connection failded', error.message);
    }
}

export const isValidPhoneNumber = (phoneNumber) => {
    // Example regex for a 10-digit number, optionally with country code and separators
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber)
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