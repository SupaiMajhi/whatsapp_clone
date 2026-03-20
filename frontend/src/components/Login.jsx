import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// store imports
import useAuthStore from "../store/auth/authStore.js";
import useGlobalStore from "../store/globalStore.js";

import { phoneSchema } from "../schema/validationSchema.js";
import PrimaryButton from "./PrimaryButton.jsx";
import CountrySelect from "./CountrySelect.jsx";
import TelephoneInput from "./TelephoneInput.jsx";

const Login = () => {
  const handleLogin = useAuthStore((state) => state.handleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const theme = useGlobalStore((state) => state.theme);


  return (
    <form className="w-full h-full flex-center flex-col space-y-7 text-dark" >
      <div className="flex-center flex-col leading-none space-y-1">
        <h1 className="text-4xl font-normal">Enter phone number</h1>
        <p className="text-lg font-normal">Select a country and enter your phone number.</p>
      </div>

      <div className="flex-center flex-col space-y-3">
        <CountrySelect />
        <TelephoneInput />
      </div>

      <div>
        <button className="w-18 min-h-9 py-2 text-base font-normal cursor-pointer bg-green-500 rounded-3xl">Next</button>
      </div>
    </form>
  );
};

export default Login;
