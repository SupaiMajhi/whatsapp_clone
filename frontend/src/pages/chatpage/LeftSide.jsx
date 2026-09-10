//components imports
import Logo from "../../assets/TextLogo.jsx";
import NewChatIcon from "../../assets/NewChatIcon.jsx";
import MenuIcon from "../../assets/MenuIcon.jsx";
import Input from "../../components/Input.jsx";
import ChatList from "../../components/ChatList.jsx";

//store imports
import useGlobalStore from "../../store/globalStore.js";

const LeftSide = ({ setShowNewChat, setIsFirstPage }) => {

  const theme = useGlobalStore((state) => state.theme);

  return (
    <div className="size-full">
      <div className={`chat_header ${theme === "dark" ? "bg-dark" : "bg-light"}`}>
        <div className="heading_container">
          <Logo className={`${theme === "dark" ? "text-white" : "text-[#1DAA61]"}`} />

          <div className="flex-center space-x-4">
            <NewChatIcon 
              className={`nav-icon ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}  
              onClick={() => setShowNewChat(true)}
            />
            <MenuIcon className={`nav-icon ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`} />
          </div>
        </div>

        <Input
          placeholder="Search a chat"
        />
      </div>

      <div className="chatlist_container">
        <ChatList setIsFirstPage={setIsFirstPage} />
      </div>
    </div>
  )
}

export default LeftSide