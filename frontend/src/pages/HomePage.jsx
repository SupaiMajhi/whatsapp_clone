import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar.jsx";
import { useEffect } from "react";

//store imports
import useGlobalStore from "../store/globalStore.js";

const HomePage = () => {

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full h-full bg-amber-700 flex-center">
        <div className="basis-[5vw] max-w-[5vw] h-full">
          <SideNavbar />
        </div>

        <div className="basis-[95vw] max-w-[95vw] overflow-hidden h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default HomePage;