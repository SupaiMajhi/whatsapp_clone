import { NavLink } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
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
                <ChatIcon className='icon' />
            </NavLink>
            <NavLink to={'/status'}>
                <StatusIcon className='icon' />
            </NavLink>
        </div>
        
        <div className="flex-center flex-col gap-5">
            <NavLink to={'/settings'}>
                <SettingIcon className='icon' />
            </NavLink>
            <NavLink to={'/profile'}>
                {userInfo?.profilePic ? (
                    <Avatar image={userInfo.profilePic} className="w-10 h-10 p-2 rounded-full"/>
                ) : (
                    <Avatar icon="pi pi-user" className="w-10 h-10 bg-neutral-700 text-center text-txtPrimary p-2 rounded-full" shape="circle" />
                )}
            </NavLink>
        </div>
    </div>
  )
}

export default Navbar;