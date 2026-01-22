import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    verification_token: {
        type: String,
        unique: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date
    },
    lastOtpSentAt: {
        type: Date,
    },
    resendCount: {
        type: Number
    }
}, { timestamps: true });

const Otp = model('Otp', otpSchema);

export default Otp;