import { motion } from "motion/react";

//store imports
import useAppStore from "../store/appStore.js";
import useGlobalStore from "../store/globalStore.js";

//components imports
import BackButton from "../assets/Back.jsx";
import Avatar from "./Avatar.jsx";
import PenIcon from "../assets/PenIcon.jsx";
import CopyIcon from "../assets/CopyIcon.jsx";

const EditProfile = () => {
  const theme = useGlobalStore((state) => state.theme);
  const userInfo = useAppStore((state) => state.userInfo);

  return (
    <motion.div
      initial={{ opacity: 0, x: "100px" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100px" }}
      transition={{ ease: "easeInOut", duration: 0.2 }}
      className={`absolute z-20 w-full h-full py-3 pl-2 pr-14 ${theme === "dark" ? "bg-dark" : "bg-light"}`}
    >
      <div
        className={`w-full flex justify-start items-center gap-2 ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        <BackButton className="size-10 p-2 rounded-full cursor-pointer hover:bg-white/10" />
        <h1 className="text-base font-normal">Edit profile</h1>
      </div>

      {/**----profile---*/}
      <div className="w-full flex-center select-none">
        <Avatar url={userInfo?.profilePic} className="w-32 h-32 mt-28 mb-20" />
      </div>

      <div
        className={`w-full pl-5 ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        {/**---- name ----**/}
        <h3
          className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-txtLight" : "text-txtDark"}`}
        >
          Name
        </h3>
        <div className="w-full flex justify-between items-center mb-14">
          <p className="text-base font-normal select-none">{userInfo?.username}</p>
          <PenIcon className="nav-icon" />
        </div>

        {/**---- phone ----**/}
        <h3
          className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-txtLight" : "text-txtDark"}`}
        >
          Phone
        </h3>
        <div className="w-full flex justify-between items-center">
          <p className="text-base font-normal select-none">{userInfo?.phone}</p>
          <CopyIcon className="nav-icon" />
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
