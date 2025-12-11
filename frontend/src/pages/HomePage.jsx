import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

//store imports
import useSocketStore from "../store/socketStore.js";

const HomePage = () => {

  const socket = useSocketStore((state) => state.socket);
  const connect = useSocketStore((state) => state.connect);

  useEffect(() => {
    
    connect();

    return () => {
      socket?.close();
    }
  }, [])

  return (
    <div className="w-screen h-screen flex">
      <div className="w-[70px] py-3 bg-primaryBg/30">
        <Navbar />
      </div>
      <div className="w-[calc(100%-70px)]">
        <Outlet />
      </div>
    </div>
  )
}

export default HomePage;