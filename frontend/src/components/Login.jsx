
import { Controller, useForm } from "react-hook-form";

// store imports
import useAuthStore from "../store/auth/authStore.js";
import useGlobalStore from "../store/globalStore.js";

import CountrySelect from "./CountrySelect.jsx";
import TelephoneInput from "./TelephoneInput.jsx";

const Login = () => {

  const { register, control, handleSubmit, formState: { errors }} = useForm();

  const handleLogin = useAuthStore((state) => state.handleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const country = useAuthStore((state) => state.country);

  const onSubmit = (data) => {
    console.log(data);
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
          name="country"
          defaultValue={country}
          control={control}
          render={({ field }) => (
            <CountrySelect {...field} />
          )}
        />
        <TelephoneInput
          register={register}
        />
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
