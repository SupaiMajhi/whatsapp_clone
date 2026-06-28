import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";

//components imports
import SideNavbar from "../components/SideNavbar.jsx";
import Separator from "../components/Separator.jsx";
import Overlay from "../components/Overlay.jsx";

//store imports
import useSocketStore from "../store/socketStore.js";
import useAppStore from "../store/appStore.js";

const HomePage = () => {

  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const showOverlay = useAppStore((state) => state.showOverlay);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    }
  }, [])

  return (
    <div className="w-screen h-screen flex-center">
      <div className="w-full h-full flex-center">
        {/**-----Overlay----- */}
        {
          <AnimatePresence>
            {showOverlay ? (
              <Overlay />
            ) : null}
          </AnimatePresence>
        }
        <div className="basis-[3.5vw] max-w-[3.5vw] h-full">
          <SideNavbar />
        </div>

        {/**-----SEPARATOR----*/}
        <Separator />

        <div className="basis-[96.5vw] max-w-[96.5vw] h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default HomePage;
