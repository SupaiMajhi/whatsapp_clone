
import * as yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";

export const loginSchema = yup.object({
    country: yup.object({
        dialCode: yup.string().required(),
        flag: yup.string().url().required(),
        alpha2: yup.string().required(),
        name: yup.string().required()
    }),
    phone: yup.string().required("phone is required").test("valid phone", "${path} is not valid.", (value, context) => {
        const { country } = context.parent;
        return isValidPhoneNumber(value, country.alpha2);
    })
});
