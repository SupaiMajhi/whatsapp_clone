
import * as yup from "yup";

import countries from "../../../country.js";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";

export const types = ['image/png', 'image/jpg', 'image/jpeg'];

export const loginSchema = yup.object({
    alpha2: yup.string().required("select country"),
    phone: yup.string().required("phone is required").test("valid phone", "${path} is not valid.", (value, context) => {
        const { alpha2 } = context.parent;
        let found = countries.find(c => c.alpha2 === alpha2);
        return isValidPhoneNumber(value, found.alpha2);
    })
});

export const profileSetupSchema = yup.object({
    username: yup.string().required("Username is required.").min(6, "Minimum character length should be 6").max(10, "too long").matches(/^[a-zA-Z0-9]+$/, "Invalid username."),
    profilePic: yup.mixed().test("fileType", "File type is not supported.", (value) => {
        if(!value?.length) return true;

        return types.includes(value[0].type);
    }).test("fileSize", "Maximum size can be of 5MB", (value) => {
        if(!value?.length) return true;

        return value[0].size <= 5000000;
    })
});
