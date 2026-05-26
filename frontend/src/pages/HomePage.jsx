import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar.jsx";
import { useEffect } from "react";

//store imports
import useSocketStore from "../store/socketStore.js";

const HomePage = () => {

  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    }
  }, [])

  return (
    <div className="w-screen h-screen flex-center">
      <div className="w-full h-full flex-center">
        <div className="basis-[4vw] max-w-[4vw] h-full">
          <SideNavbar />
        </div>
        <div className="basis-[96vw] max-w-[96vw] h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default HomePage;
