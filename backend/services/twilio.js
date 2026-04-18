import twilio from "twilio";

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTPtoPhoneNumber = async(otp, phoneNumber, dialCode) => {
    try {
        await client.messages.create({
            body: `${otp} is your verification code. For your security, do not share this code.`,
            to: `${dialCode}${phoneNumber}`,
            from: process.env.TWILIO_PHONE_NUMBER
        });
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to send otp.');
    }
};;