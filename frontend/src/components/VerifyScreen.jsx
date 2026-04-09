import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import useGlobalStore from "../store/globalStore.js";
import useAuthStore from "../store/auth/authStore.js";

const VerifyScreen = () => {

  const LENGTH = 6;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef(null);
  const [index, setIndex] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      otp
    }
  });
  

  useEffect(() => {
    if(inputRef.current){
      const nodes = inputRef.current.querySelectorAll("input");
      nodes[index].focus();
    }
  }, [inputRef.current, index])



  function handleOnChange(e, i){
    const value = e.target.value.replace(/\D/g, '');
    if(!value) return;

    setOtp((oldOtp) => {
      const newOtp = [...oldOtp];
      newOtp[i] = value;
      return newOtp;
    });

    if(i < LENGTH - 1){
      setIndex(i + 1);
    }
  }

  function handleKeyDown(e, i){
    if(e.key === "Backspace"){
      setOtp((oldOtp) => {
        const newOtp = [...oldOtp];
        newOtp[i] = '';
        return newOtp;
      });
      if(i > 0){
        setIndex(i - 1);
      }
    }
  }


  const onSubmit = (data) => {
    console.log(data);
  }


  return (
    <form 
      id="otp-form" 
      name="otp" 
      onSubmit={handleSubmit(onSubmit)}
      ref={inputRef}
      className="w-full h-full flex-center flex-col space-y-5 text-dark bg-lightNav rounded-xl shadow-sm/20"  
    >
      <h1 className="text-4xl font-normal">OTP verification</h1>
      <p className="text-base px-3 text-lightStatTxt font-normal text-center tracking-tight">Please enter the OTP (One-Time-password) sent to your registered email/phone number to complete your verification.</p>
      <div className="w-xl h-20 flex-center space-x-4">
        {Array.from({ length: LENGTH }).map((_, i) => (
          <Input
            key={i}
            type="text"
            inputMode="numeric"
            minLength={0}
            maxLength={1}
            value={otp[i]}
            autoComplete="off"
            register={register}
            index={i}
            onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
            onChange={(e) => handleOnChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-14 h-14 text-center text-base font-semibold bg-[#E7E7E7] rounded-md shadow-sm/40"
          />
        ))}
      </div>
      <button type="submit" className="w-20 py-2 text-base text-white font-normal bg-btnPrimary rounded-xl hover:bg-btnSecondary cursor-pointer">submit</button>
    </form> 
  )
};

export default VerifyScreen;


const Input = ({ className="", register, index, ...props }) => {
    return(
        <input {...register(`otp.${index}`)} className={`${className}`} {...props} />
    )
}