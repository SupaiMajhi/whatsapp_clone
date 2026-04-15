import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    verification_token_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Token",
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
        default: Date.now() + (1000 * 60 * 2),
        expires: 0,
    }
}, { timestamps: true });

const Otp = model('Otp', otpSchema);

export default Otp;