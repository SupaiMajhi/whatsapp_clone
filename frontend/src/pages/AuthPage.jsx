
import { Outlet } from "react-router-dom";
// store imports
import useGlobalStore from "../store/globalStore.js";

const AuthPage = () => {
  const isLoading = useGlobalStore((state) => state.isLoading);
  const theme = useGlobalStore((state) => state.theme);


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
    <div
      className={`screen-container ${theme === "light" ? "bg-lightNav" : "bg-darkNav"}`}
    >
      <div
        className={`mini-container ${theme === "light" ? "bg-light" : "bg-dark"} rounded-2xl`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;