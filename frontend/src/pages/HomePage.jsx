import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar.jsx";
import { useEffect } from "react";

//store imports
import useSocketStore from "../store/socketStore.js";

const HomePage = () => {

  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const socket = useSocketStore((state) => state.socket);

  console.log(socket)

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    }
  }, [])

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full h-full flex-center">
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