import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import useGlobalStore from "../store/globalStore.js";
import useAuthStore from "../store/auth/authStore.js";
import { otpSchema } from "../schema/validationSchema.js" 

const VerifyScreen = ({ phoneNumber = "+91 98765 43210" }) => {
  const length = 6;
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: Array(6).fill(""),
    },
  });
  const handleVerify = useAuthStore((state) => state.handleVerify);

  const theme = useGlobalStore((state) => state.theme);
  const otpValues = watch("otp");
  const isComplete = otpValues.every(v => v !== "");

  // Handle Countdown Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Typing
  const handleChange = (value, index) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, length).split("");

      pasted.forEach((char, i) => {
        setValue(`otp.${i}`, char);
      });
      setFocus(`otp.${pasted.length - 1}`);
      return;
    }

    // Move to next input
    if (value && index < length - 1) {
      setFocus(`otp.${index + 1}`);
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      setFocus(`otp.${index - 1}`);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setIsResendDisabled(true);
    inputRefs.current[0].focus();
  };

  const onSubmit = async (data) => {
    try {
      const finalOtp = data.otp.join('');
      await handleVerify({'otp': finalOtp});
    } catch (error) {
      console.log(error.message);
      // set the error to a state
    }
  }

  return (
    <form
      className={`custom-container rounded-inherit ${theme === "light" ? "bg-light" : "bg-dark"}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className={`w-full max-w-md ${theme === "light" ? "bg-light" : "bg-dark"} rounded-3xl shadow-xl p-8 transition-all ${error ? "animate-shake" : ""}`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className={`text-2xl font-bold ${theme === "light" ? "text-txtDark" : "text-txtLight"} mb-2`}
          >
            Verify your number
          </h2>
          <p
            className={`text-sm ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
          >
            Enter the 6-digit code sent to{" "}
            <span
              className={`font-semibold ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
            >
              {phoneNumber}
            </span>
          </p>
          <button
            className={`text-xs font-medium ${theme === "light" ? "text-emerald-600" : "text-emerald-400"} mt-1 hover:underline`}
          >
            Wrong number?
          </button>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              {...register(`otp.${index}`, {
                onChange: (e) => handleChange(e.target.value, index)
              })}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none
                ${
                  error
                    ? `border-red-500 ${theme === "light" ? "bg-red-50" : "bg-red-900/10"}`
                    : `${theme === "light" ? "border-gray-200 focus:border-emerald-500" : "border-zinc-700 focus:border-emerald-500 text-white"} bg-transparent`
                }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {errors.otp && (
          <p className="text-red-500 text-center text-sm mb-4 animate-fade-in">
            {errors.otp?.message || "Invalid OTP."}
          </p>
        )}

        {/* Timer/Resend */}
        <div className="text-center mb-8">
          {isResendDisabled ? (
            <p
              className={`text-sm ${theme === "light" ? "text-gray-500" : "text-zinc-500"}`}
            >
              Resend code in{" "}
              <span className="font-mono">
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className={`text-sm font-bold ${theme === "light" ? "text-emerald-600 hover:text-emerald-700" : "text-emerald-400"}`}
            >
              Resend code
            </button>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={!isComplete}
          className={`w-full py-4 rounded-full font-bold text-white transition-all shadow-lg
            ${
              isComplete
                ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                : `${theme === "light" ? "bg-gray-300" : "bg-zinc-800"} cursor-not-allowed`
            }`}
        >
          Verify
        </button>
      </div>
    </form>
  );
};

export default VerifyScreen;
