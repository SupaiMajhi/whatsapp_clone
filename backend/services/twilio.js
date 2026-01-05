import twilio from "twilio";
import { generateOtp } from "../lib/lib.js";

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTPtoPhoneNumber = async(otp, phoneNumber) => {
    try {
        await client.messages.create({
            body: `${otp} is your verification code. For your security, do not share this code.`,
            to: `+91${phoneNumber}`,
            from: process.env.TWILIO_PHONE_NUMBER
        });
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to send otp.');
    }
};;