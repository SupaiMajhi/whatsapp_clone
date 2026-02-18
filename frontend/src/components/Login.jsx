import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// store imports
import useAuthStore from "../store/auth/authStore.js";
import useGlobalStore from "../store/globalStore.js";

import { phoneSchema } from "../schema/validationSchema.js";
import PrimaryButton from "./PrimaryButton.jsx";
import CountrySelect from "./CountrySelect.jsx";
import countries from "../../country.js";

const Login = () => {
  const country = useAuthStore((state) => state.country);
  const handleLogin = useAuthStore((state) => state.handleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const theme = useGlobalStore((state) => state.theme);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(phoneSchema),
    context: { country },
  });


  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className={`custom-container flex-col ${theme === "light" ? "bg-light" : "bg-dark"}  rounded-inherit ${theme === "light" ? "text-txtDark" : "text-txtLight"} gap-5`}
    >
      <div className="flex-center flex-col">
        <h1 className={`text-2xl ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}>Enter phone number</h1>
        <p className={`text-md tracking-wide ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}>
          Select a country and enter your phone number.
        </p>
      </div>

      <div className="w-[300px] flex flex-col items-center gap-3">
        <Controller
          name="dialCode"
          control={control}
          render={({ field }) => (
            <CountrySelect onChange={field.onChange} countries={countries} />
          )}
        />
        <div className={`w-full h-[50px] flex items-center gap-1 border rounded-3xl pl-4 text-[0.9rem] ${theme === "light" ? "text-txtDark" : "text-txtLight"} font-medium`}>
          <span>{country?.dialCode}</span>
          <input
            type="tel"
            autoComplete="off"
            {...register("phone")}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setValue("phone", value, { shouldValidate: true });
            }}
            inputMode="numeric"
            className="flex-1 h-full outline-none bg-inherit rounded-r-inherit"
          />
        </div>
        {/**-------ERROR MESSAGE------- */}
        {errors.phone && (
          <p className="text-[1rem] text-rose-700 py-2 px-4 bg-rose-200 rounded-lg">
            {errors.phone?.message}
          </p>
        )}
      </div>
      <PrimaryButton
        type="submit"
        className={`w-20 rounded-3xl text-center text-sm font-medium tracking-wide outline-none bg-btnPrimary hover:bg-btnSecondary ${theme === "light" ? "text-black" : "text-white"}`}
      >
        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Next'}
      </PrimaryButton>
    </form>
  );
};

export default Login;
