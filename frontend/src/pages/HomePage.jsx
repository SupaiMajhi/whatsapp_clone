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
    };
  }, []);

  return (
    <div className="screen">
      <div className="home">
        <div className="w-16 h-full">
          <SideNavbar />
        </div>

        <Separator />

        <div className="flex-1 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
