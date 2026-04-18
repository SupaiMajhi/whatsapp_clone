import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    phone: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
        default: Date.now() + (1000 * 60 * 5),
        expires: 0,
    }
}, { timestamps: true });

const Otp = model('Otp', otpSchema);

export default Otp;