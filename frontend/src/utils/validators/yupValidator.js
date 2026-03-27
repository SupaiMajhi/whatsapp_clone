
import * as yup from "yup";

import countries from "../../../country.js";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";

export const loginSchema = yup.object({
    alpha2: yup.string().required("select country"),
    phone: yup.string().required("phone is required").test("valid phone", "${path} is not valid.", (value, context) => {
        const { alpha2 } = context.parent;
        let found = countries.find(c => c.alpha2 === alpha2);
        return isValidPhoneNumber(value, found.alpha2);
    })
});
