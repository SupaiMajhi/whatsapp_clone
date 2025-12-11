import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    phone: {
        type: String,
        unique: true,
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date
    }
}, { timestamps: true });

const Otp = model('Otp', otpSchema);

export default Otp;