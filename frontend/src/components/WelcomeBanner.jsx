import { NavLink } from "react-router-dom";

import PrimaryButton from "./PrimaryButton";

// store imports
import useGlobalStore from "../store/globalStore.js";

const WelcomeBanner = () => {

  const theme = useGlobalStore((state) => state.theme);
  
  return (
        <div className={`custom-container flex-col gap-3`}>
          <h1 className={`text-2xl mb-4 ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}>Welcome to WhatsApp</h1>
          <p className={`w-[530px] text-md text-center mb-4 ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}>
            Simple, reliable and private. Message privately, make calls and share
            files with your friends, family and colleagues.
          </p>
          <NavLink to='/auth/get_otp'>
            <PrimaryButton className="w-[170px] text-[0.85rem] font-semibold text-black text-center rounded-2xl hover:scale-105 hover:transition-transform duration-150">Login</PrimaryButton>
          </NavLink>
        </div>  
  );
};

export default WelcomeBanner;
