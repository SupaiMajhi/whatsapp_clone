
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// store imports
import useAuthStore from "../store/auth/authStore.js";
import useGlobalStore from "../store/globalStore.js";

import CountrySelect from "./CountrySelect.jsx";
import TelephoneInput from "./TelephoneInput.jsx";
import { loginSchema } from "../utils/validators/yupValidator.js"

const Login = () => {

  const { register, control, handleSubmit, formState: { errors }} = useForm({
    defaultValues: {
      dialCode: "+91",
      alpha2: "IN"
    },
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = useAuthStore((state) => state.handleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);

  const onSubmit = async (data) => {
    await handleLogin(data);
  }

  return (
    <form 
      className="w-full h-full flex-center flex-col space-y-7 text-dark"
      onSubmit={handleSubmit(onSubmit)}   
    >
      <div className="flex-center flex-col leading-none space-y-1">
        <h1 className="text-4xl font-normal">Enter phone number</h1>
        <p className="text-lg font-normal">Select a country and enter your phone number.</p>
      </div>

      <div className="flex-center flex-col space-y-3">
        <Controller
          name="alpha2"
          control={control}
          render={({field: { onChange }}) => (
            <CountrySelect
              onChange={onChange}
            />
          )}
        />        
        <TelephoneInput
          register={register}
        />
        <p>{errors?.phone?.message}</p>
      </div>

      <div>
        <button 
          className="w-18 min-h-9 py-2 text-base font-normal cursor-pointer bg-btnPrimary rounded-3xl mt-8"
          type="submit"
        >
          { isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Next"
          )}
        </button>
      </div>
    </form>
  );
};

export default Login;
