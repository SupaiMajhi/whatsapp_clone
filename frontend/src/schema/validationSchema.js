import * as yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";

export const phoneSchema = yup.object({
    phone: yup.string().required('Phone number is required.').test('valid phone','Valid phone number is required.', function (value) {
        const { country } = this.options.context;
        return isValidPhoneNumber(value, country?.alpha2);
    })
});

export const otpSchema = yup.object({
    otp: yup.array().of(yup.string().required().matches(/^[0-9]$/, 'Must be a digit.')).length(6, "OTP must be 6 digits")
});