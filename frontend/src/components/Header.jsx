import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '../assets/MenuIcon';
import SearchIcon from '../assets/SearchIcon';
import { formatMessageTime } from "../lib.js";

//store imports
import useUserStore from "../store/userStore.js";
import useAppStore from "../store/appStore.js";
import useGlobalStore from "../store/globalStore.js";

const Header = () => {

  const userStatus = useUserStore((state) => state.userStatus);
  const currentRcvr = useAppStore((state) => state.currentRcvr);
  const theme = useGlobalStore((state) => state.theme);

  return (
    <div
      className={`sticky top-0 left-0 z-10 w-full h-20 max-h-20 flex justify-between items-center py-2 pl-4 pr-6 ${theme === "light" ? "bg-light text-black" : "bg-dark text-white"}`}
    >
      {/** INFO DIV */}
      <div className="w-fit h-full flex justify-center items-center gap-4">
        {/** AVATAR */}
        <div className="w-12 h-12 flex justify-center items-center">
          {currentRcvr?.profilePic ? (
            <Avatar className="w-full" src={currentRcvr.profilePic} />
          ) : (
            <AccountCircleIcon
              className={`text-[60px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
            />
          )}
        </div>

        {/** USERNAME & ONLINE, OFFLINE */}
        <div className="w-fit h-full flex flex-col justify-center">
          <h1 className="text-xl font-medium">{currentRcvr?.username}</h1>
          <div className={`text-sm font-medium ${theme === "light" ? "text-lightStatTxt" : "text-darkStatTxt"}`}>
            {userStatus?.isOnline ? (
              <p>online</p>
            ) : (
              <p>last seen at {formatMessageTime(userStatus?.lastSeen)}</p>
            )}
          </div>
        </div>
      </div>

      {/** ICON DIV */}
      <div className={`w-fit h-full flex justify-center items-center gap-7 ${theme === "light" ? "text-black" : "text-white"}`}>
        <button>
          <SearchIcon className="cursor-pointer" />
        </button>
        <button>
          <MenuIcon className="cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default Header;