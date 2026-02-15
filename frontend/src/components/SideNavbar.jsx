import { NavLink } from "react-router-dom";
// import { Avatar } from 'primereact/avatar';
import  Avatar  from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '../assets/ChatIcon';
import StatusIcon from '../assets/StatusIcon';
import SettingIcon from '../assets/SettingIcon';

// Store imports
import useGlobalStore from "../store/globalStore.js";
import useAuthStore from "../store/auth/authStore.js";

const Navbar = () => {

    const theme = useGlobalStore((state) => state.theme);
    const userInfo = useAuthStore((state) => state.userInfo);

  return (
    <div className={`custom-container flex-col justify-between ${theme === "light" ? "bg-lightNav" : "bg-darkNav"} py-5 px-2`}>
        <div className="flex-center flex-col gap-7">
            <NavLink to={'/'}>
                <ChatIcon className={`${theme === "light" ? "icon-dark" : "icon-light"}`} />
            </NavLink>
            <NavLink to={'/status'}>
                <StatusIcon className={`${theme === "light" ? "icon-dark" : "icon-light"}`} />
            </NavLink>
        </div>
        
        <div className="flex-center flex-col gap-5">
            <NavLink to={'/settings'}>
                <SettingIcon className={`${theme === "light" ? "icon-dark" : "icon-light"}`} />
            </NavLink>
            <NavLink to={'/profile'}>
                {userInfo?.profilePic ? (
                    <Avatar src={userInfo.profilePic} sx={{ width: 40, height: 40 }} />
                ) : (
                        <AccountCircleIcon className={`text-[35px]! ${theme === "light" ? "text-txtLight" : "text-txtDark"}`} />
                )}
            </NavLink>
        </div>
    </div>
  )
}

export default Navbar;