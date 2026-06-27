//store imports
import useGlobalStore from "../store/globalStore.js";
import useAppStore from "../store/appStore.js";

//compo imports
import LogoutIcon from "../assets/LogoutIcon.jsx";

function Logout() {

  const theme = useGlobalStore((state) => state.theme);
  const setIsPopUpVisible = useAppStore((state) => state.setIsPopUpVisible);
  const setShowOverlay = useAppStore((state) => state.setShowOverlay);

  function handleOnClick(){
    setShowOverlay(true);
    setIsPopUpVisible(true);
  }

  return (
    <button
      onClick={handleOnClick}
      className={`w-full h-16 px-5 py-2 mb-3 cursor-pointer rounded-xl flex justify-start items-center space-x-5 ${theme === "dark" ? "hover:bg-rose-900/20" : "hover:bg-rose-300/20"}`}
    >
      <div className="w-max">
        <LogoutIcon className={`size-6 text-red-400`} />
      </div>

      <div className="flex flex-col justify-center text-left">
        <h3 className="text-base text-red-400 font-medium">Log out</h3>
      </div>
    </button>
  );
}

export default Logout;