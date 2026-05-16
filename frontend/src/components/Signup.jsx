import { useRef } from "react";

import useGlobalStore from "../store/globalStore.js";
import PlusIcon from "../assets/PlusIcon.jsx";

const Signup = () => {

  const fileRef = useRef(null);
  const theme = useGlobalStore((state) => state.theme);

  const handleOnClick = (e) => {
    fileRef.current.click();
  }

  return (
    <div className={`w-full h-full flex flex-col justify-center items-center ${theme === "dark" ? "bg-dark text-txtLight" : "bg-light text-txtDark"}`}>
      <div className="flex flex-col items-center justify-center space-y-5">
        <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-3xl font-medium tracking-wide`}>Profile info</h3>

        <p className="text-xl mb-5">Please provide your name and an optional profile photo</p>

        <div onClick={handleOnClick} className="w-37.5 h-37.5 flex justify-center items-center overflow-hidden">
          <div className="relative w-full h-full rounded-full bg-white">
            <div className="absolute right-1 bottom-1 z-10 flex justify-center items-center w-10 h-10 bg-green-500 rounded-full">
              <PlusIcon className="size-8 text-white" />
            </div>
          </div>
          <input type="file" ref={fileRef} className="hidden" />
        </div>

        <div className="w-full">
          <input type="text" name="username" autoComplete="off" className="w-full py-1 border-b-2 border-green-700 outline-none text-xl" placeholder="Type your name here" />
        </div>

        <div className="w-2xs mt-10 py-2 text-xl text-center text-white font-medium rounded-xl bg-green-600">
          <button>Next</button>
        </div>
      </div>
    </div>
  )
}

export default Signup;