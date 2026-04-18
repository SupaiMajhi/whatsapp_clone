import { Schema, model } from "mongoose";

const otpProviderSchema = new Schema({
    phone: {
        type: String,
        unique: true,
        required: true
    },
    lastOtpSentAt: {
        type: Date,
    },
    totalOtpSentCount: {
        type: Number
    },
    tryCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

otpProviderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const otpProvider = model('otpProvider', otpProviderSchema);

export default otpProvider;