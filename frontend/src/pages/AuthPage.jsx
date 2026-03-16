
import { Outlet } from "react-router-dom";

// store imports
import useGlobalStore from "../store/globalStore.js";

//components imports
import TextLogo from "../assets/TextLogo.jsx";
import Logo from "../assets/Logo.jsx";
import CountrySelect from "../components/CountrySelect.jsx";

const AuthPage = () => {
  const isLoading = useGlobalStore((state) => state.isLoading);

  return (
    <div className="screen-container py-3 px-5 sm:px-8 bg-authBg">
      <div className="flex items-center space-x-1">
        <Logo className="size-7 text-green-500" />
        <TextLogo className="w-20 text-green-500" />
      </div>

      <div className="w-full h-full flex-center select-none">
        <div className="min-w-sm w-md h-96 sm:w-2xl px-5 py-8 sm:p-12 flex-center flex-col space-y-5 bg-white rounded-2xl shadow border">
          { isLoading ? (
            <h1>Loading....</h1>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
