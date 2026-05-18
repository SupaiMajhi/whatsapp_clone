import { useRef } from "react";
import { useForm } from "react-hook-form";

import useGlobalStore from "../store/globalStore.js";
import PlusIcon from "../assets/PlusIcon.jsx";
import Logo from "../assets/Logo.jsx";
import TextLogo from "../assets/TextLogo.jsx";

const Signup = () => {

  const fileRef = useRef(null);
  const theme = useGlobalStore((state) => state.theme);
  const { register, handleSubmit, formState: { errors }} = useForm();

  const handleOnSubmit = (e) => {
    console.log(e)    
  }

  return (
    <div className={`w-screen h-screen overflow-hidden py-5 px-10 ${theme === "dark" ? "bg-dark text-txtLight" : "bg-light text-txtDark"}`}>
      <div className="w-full text-green-500 flex justify-start items-center space-x-1">
        <Logo className="size-7" />
        <TextLogo />
      </div>

      <div className="w-full h-full flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col items-center justify-center space-y-5">
          <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-3xl font-medium tracking-wide`}>Profile info</h3>

          <p className="text-xl mb-5">Please provide your name and an optional profile photo</p>

          <div onClick={() => fileRef.current.click()} className="w-37.5 h-37.5 flex justify-center items-center overflow-hidden">
            <div className="relative w-full h-full rounded-full bg-white">
              <div className="absolute right-1 bottom-1 z-10 flex justify-center items-center w-10 h-10 bg-green-500 rounded-full">
                <PlusIcon className="size-8 text-white" />
              </div>
            </div>
            <input type="file" {...register("file")} ref={fileRef} className="hidden" />
          </div>

          <div className="w-full">
            <input type="text" {...register("username", { required: true, minLength: 5 })} autoComplete="off" className="w-full py-1 border-b-2 border-green-700 outline-none text-xl" placeholder="Type your name here" />
            {errors.username && <p className="mt-2 text-red-300 text-base tracking-widest">Username is requried.</p>}
          </div>

          <div className="w-2xs mt-10 py-2 text-xl text-center text-white font-medium rounded-xl bg-green-600">
            <button type="submit" className="cursor-pointer">Next</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup;