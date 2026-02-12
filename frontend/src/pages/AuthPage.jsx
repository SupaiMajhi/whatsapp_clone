import { useEffect } from "react";
import { Outlet } from "react-router-dom";
// store imports
import useAuthStore from "../store/auth/authStore.js";
import useGlobalStore from "../store/globalStore.js";

import VerifyScreen from "../components/VerifyScreen.jsx";
import Login from "../components/Login.jsx";

const AuthPage = () => {
  const isLoading = useGlobalStore((state) => state.isLoading);
  const otp_token = useGlobalStore((state) => state.otp_token);
  const handleCheckVT = useAuthStore((state) => state.handleCheckVT);
  const theme = useGlobalStore((state) => state.theme);


  useEffect(() => {
    async function doSomething(){
      await handleCheckVT();
    }
    doSomething();
  }, [otp_token]);

  if (isLoading) {
    return (
      <div className="screen-container bg-bgPrimary">
        <div className="mini-container">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={`screen-container ${theme === "light" ? "bg-lightNav": "bg-darkNav"}`}>
      <div className={`mini-container ${theme === "light" ? "bg-light" : "bg-dark"} rounded-2xl`}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;