import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
    verification_token: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    lastOtpSentAt: {
        type: Date,
    },
    otpSentTotalCount: {
        type: Number
    }
}, { timestamps: true });

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Token = model('Token', tokenSchema);

export default Token;