import Avatar from "./Avatar";
import MenuIcon from '../assets/MenuIcon';
import SearchIcon from '../assets/SearchIcon';
import { validateTime } from "../lib.js";

//store imports
import useUserStore from "../store/userStore.js";

const Header = () => {

  const userStatus = useUserStore((state) => state.userStatus);
  const currentRcvr = useUserStore((state) => state.currentRcvr);

  return (
    <div className="w-full min-h-14 max-h-16 flex justify-center items-center gap-3 bg-primaryBg cpadding">
      <div className="w-10"><Avatar /></div>
      <div className="grow flex flex-col">
        <h1 className="chat-heading">{currentRcvr.username}</h1>
        {userStatus?.isOnline ? 
          <p className="text-[0.8rem] font-semibold text-baseClr">online</p>
          :
          <p className="text-[0.8rem] font-semibold text-baseClr">last seen today at {validateTime(userStatus?.lastSeen)}</p>
        }
      </div>
      <div className="flex justify-evenly items-center gap-10">
        <SearchIcon className='icon text-white'/>
        <MenuIcon className='icon text-white'/>
      </div>
    </div>
  )
}

export default Header;