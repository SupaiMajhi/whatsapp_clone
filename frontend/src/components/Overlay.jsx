import { motion } from "motion/react";

import useAppStore from "../store/appStore.js";

function Overlay(){

  const setShowOverlay = useAppStore((state) => state.setShowOverlay);
  const setIsPopUpVisible = useAppStore((state) => state.setIsPopUpVisible);

  function handleOnClick() {
    setIsPopUpVisible(false);
    setShowOverlay(false);
  }

  return (
    <motion.div
      onClick={handleOnClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className={`absolute z-20 screen-container flex-center bg-black/30`}
    ></motion.div>
  );
}

export default Overlay;
