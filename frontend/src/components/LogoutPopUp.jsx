import { motion } from "motion/react";

//store imports
import useAuthStore from "../store/authStore.js";
import useGlobalStore from "../store/globalStore.js";
import useAppStore from "../store/appStore.js";

const LogoutPopUp = () => {
  const handleLogout = useAuthStore((state) => state.handleLogout);
  const theme = useGlobalStore((state) => state.theme);
  const setIsPopUpVisible = useAppStore((state) => state.setIsPopUpVisible);
  const setShowOverlay = useAppStore((state) => state.setShowOverlay);

  function handleOnClick() {
    setIsPopUpVisible(false);
    setShowOverlay(false);
  }

  return (
    <motion.div
      className={`flex flex-col justify-center w-lg h-fit px-6 py-5 rounded-2xl shadow-xl/50 shadow-black/80 ${theme === "dark" ? "bg-darkNav text-txtLight" : "bg-white text-txtDark"}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeIn" }}
      exit={{
        opacity: 0,
        scale: 0,
        transition: { duration: 0.15, ease: "easeIn" },
      }}
    >
      <h1
        className={`text-xl ${theme === "dark" ? "text-white" : "text-black"} font-normal mb-6`}
      >
        Log out?
      </h1>
      <p className="text-base font-normal tracking-wide mb-20">
        Are you sure, you want to logout?
      </p>
      <div className="flex justify-end items-center space-x-4">
        <button
          onClick={handleOnClick}
          className={`w-20 px-3 py-2.5 text-center text-sm font-normal rounded-3xl cursor-pointer text-green-500 ${theme === "dark" ? "hover:bg-green-600/20" : "text-green-700 hover:bg-green-700/10"}`}
        >
          Cancel
        </button>
        <button
          onClick={() => handleLogout()}
          className={`w-24 px-5 p-2.5 text-center text-sm font-normal rounded-3xl cursor-pointer bg-red-400 hover:bg-rose-400 ${theme === "dark" ? "text-black" : "text-white bg-rose-600 hover:bg-rose-700"}`}
        >
          Log out
        </button>
      </div>
    </motion.div>
  );
};

export default LogoutPopUp;
