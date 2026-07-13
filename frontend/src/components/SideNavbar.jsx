import { useState } from "react";
import { NavLink } from "react-router-dom";

//components imports
import  Avatar  from './Avatar.jsx';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ActiveChatIcon from '../assets/ActiveChatIcon.jsx';
import ChatIcon from "../assets/ChatIcon.jsx";
import ActiveStatusIcon from '../assets/ActiveStatusIcon.jsx';
import StatusIcon from "../assets/StatusIcon.jsx";

// Store imports
import useGlobalStore from "../store/globalStore.js";
import useAppStore from "../store/appStore.js";

const Navbar = () => {

    const theme = useGlobalStore((state) => state.theme);
    const userInfo = useAppStore((state) => state.userInfo);
    const [isActive, setIsActive] = useState("chat");

  return (
    <div className={`custom-container flex-col justify-between ${theme === "light" ? "bg-lightNav" : "bg-darkNav"} p-3.5`}>
      <div className="flex flex-col items-center gap-3">
        <NavLink 
          to={'/'}
          onClick={() => setIsActive("chat")}
          className={`${isActive === "chat" ? "nav-active" : "nav-icon"}`}
        >
          {({ isActive }) => isActive ? (
            <ActiveChatIcon className={`${theme === "light" ? "text-dark" : "text-light"}`} />
          ) : (
              <ChatIcon className={`${theme === "light" ? "text-dark" : "text-light"}`} />
            )}
        </NavLink>
        <NavLink 
          to={'/status'}
          onClick={() => setIsActive("status")}
          className={`${isActive === "status" ? "nav-active" : "nav-icon"}`}
        >
          {({ isActive }) => isActive ? (
            <ActiveStatusIcon className={`${theme === "light" ? "text-dark" : "text-light"}`} />
          ) : (
              <StatusIcon className={`${theme === "light" ? "text-dark" : "text-light"}`} />
            )}  
        </NavLink>
      </div>

      <div className="flex-center flex-col gap-5">
        <NavLink 
          to={'/profile'}
          onClick={() => setIsActive("profile")}
          className={`${isActive === "profile" ? "nav-active" : "nav-icon"}`}
        >
          {userInfo?.profilePic ? (
            <Avatar url={userInfo?.profilePic} className="w-7 h-7" />
          ) : (
              <AccountCircleIcon className={`text-[35px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`} />
            )}
        </NavLink>
      </div>
    </div>
  )
}

export default Navbar;
