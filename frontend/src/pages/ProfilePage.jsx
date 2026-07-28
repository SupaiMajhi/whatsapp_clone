import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

//components imports
import LeftContainer from "../pages/profilePage/LeftContainer.jsx";
import RightContainer from "../pages/profilePage/RightContainer.jsx";
import LogoutPopUp from "../components/LogoutPopUp.jsx";
import Separator from "../components/Separator.jsx";

//store imports
import useGlobalStore from "../store/globalStore.js";
import useAppStore from "../store/appStore.js";

const ProfilePage = () => {

  const theme = useGlobalStore((state) => state.theme);
  const isPopUpVisible = useAppStore((state) => state.isPopUpVisible);

  return (
    <div className="relative custom-container">
      {/**LOGOUT POPUP */}
      <AnimatePresence>
        {isPopUpVisible ? (
          <div onClick={(e) => e.stopPropagation()} className="absolute z-50">
            <LogoutPopUp />
          </div>
        ): null}
      </AnimatePresence>

      {/**LEFT SIDE */}
      <LeftContainer />

      {/**-----SEPARATOR------ */}
      <Separator />

      {/**RIGHT SIDE */}
      <RightContainer />
    </div>
  );
}

export default ProfilePage;
