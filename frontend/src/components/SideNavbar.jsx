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

import { navData } from "../data.js";

const Navbar = () => {

    const theme = useGlobalStore((state) => state.theme);
    const userInfo = useAppStore((state) => state.userInfo);
    const [isActive, setIsActive] = useState("chat");

  return (
    <div className={`size-full`}>
      {/** Mobile */}
      <div
        className={`size-full flex-center ${theme === "dark" ? "bg-darkNav" : "bg-lightNav"}`}
      >
        <div
          className={`nav-bar_mobile ${theme === "dark" ? "bg-black/10 shadow-white/30" : "bg-light/10 shadow-black/50"}`}
        >
          {navData.map((d, i) => (
            <NavLink
              key={i}
              to={d.to}
              onClick={() => setIsActive(d.value)}
              className={`${isActive === d.value ? `nav-active ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}` : "nav-icon"}`}
            >
              {({ isActive }) =>
                isActive ? (
                  <d.active
                    className={`${theme === "light" ? "text-dark" : "text-light"}`}
                  />
                ) : (
                  <d.normal
                    className={`${theme === "light" ? "text-dark" : "text-light"}`}
                  />
                )
              }
            </NavLink>
          ))}

          <NavLink
            to={"/profile"}
            onClick={() => setIsActive("profile")}
            className={`${isActive === "profile" ? `nav-active ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"}` : "nav-icon"}`}
          >
            {userInfo?.profilePic ? (
              <Avatar url={userInfo?.profilePic} className="w-7 h-7" />
            ) : (
              <AccountCircleIcon
                className={`text-[35px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
              />
            )}
          </NavLink>
        </div>
      </div>

      {/** Laptop */}
      {/**<div className="size-full hidden lg:block flex-col items-center gap-3 bg-red-600">
        <NavLink
          to={"/"}
          onClick={() => setIsActive("chat")}
          className={`${isActive === "chat" ? "nav-active" : "nav-icon"}`}
        >
          {({ isActive }) =>
            isActive ? (
              <ActiveChatIcon
                className={`${theme === "light" ? "text-dark" : "text-light"}`}
              />
            ) : (
              <ChatIcon
                className={`${theme === "light" ? "text-dark" : "text-light"}`}
              />
            )
          }
        </NavLink>
        <NavLink
          to={"/status"}
          onClick={() => setIsActive("status")}
          className={`${isActive === "status" ? "nav-active" : "nav-icon"}`}
        >
          {({ isActive }) =>
            isActive ? (
              <ActiveStatusIcon
                className={`${theme === "light" ? "text-dark" : "text-light"}`}
              />
            ) : (
              <StatusIcon
                className={`${theme === "light" ? "text-dark" : "text-light"}`}
              />
            )
          }
        </NavLink>
      </div>

      <div className="flex-center flex-col gap-5">
        <NavLink
          to={"/profile"}
          onClick={() => setIsActive("profile")}
          className={`${isActive === "profile" ? "nav-active" : "nav-icon"}`}
        >
          {userInfo?.profilePic ? (
            <Avatar url={userInfo?.profilePic} className="w-7 h-7" />
          ) : (
            <AccountCircleIcon
              className={`text-[35px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
            />
          )}
        </NavLink>
      </div>*/}
    </div>
  );
}

export default Navbar;
