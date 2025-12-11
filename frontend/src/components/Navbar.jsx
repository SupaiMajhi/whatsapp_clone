import { NavLink } from "react-router-dom";
import ChatIcon from '../assets/ChatIcon';
import StatusIcon from '../assets/StatusIcon';
import SettingIcon from '../assets/SettingIcon';

const Navbar = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="flex-column gap-5">
            <NavLink to={'/'}>
                <ChatIcon className='icon' />
            </NavLink>
            <NavLink to={'/status'}>
                <StatusIcon className='icon' />
            </NavLink>
        </div>
        
        <div className="flex-column">
            <NavLink to={'/settings'}>
                <SettingIcon className='icon' />
            </NavLink>
            <NavLink to={'/profile'}></NavLink>
        </div>
    </div>
  )
}

export default Navbar;