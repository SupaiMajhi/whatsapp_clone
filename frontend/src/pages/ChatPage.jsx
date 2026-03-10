import Logo from "../assets/Logo";
import NewChatIcon from "../assets/NewChatIcon";
import MenuIcon from "../assets/MenuIcon";
import Input from "../components/Input";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import Advertise from "./Advertise";

//store imports
import useGlobalStore from "../store/globalStore.js";
import useAppStore from "../store/appStore.js";

const ChatPage = () => {
  
  const theme = useGlobalStore((state) => state.theme);
  const isChatSelected = useAppStore((state) => state.isChatSelected);

  return (
    <div className="relative custom-container">
      {/** LEFT SIDE */}
      <div className={`basis-[calc(100%-70%)] max-w-[calc(100%-70%)] h-full flex-center flex-col ${theme === "light" ? "bg-light text-dark" : "bg-dark text-white"}`}>
        
        <div className={`w-full h-[calc(100%-90%)] max-h-[calc(100%-90%)] flex items-center justify-between pl-6 pr-7 ${theme === "light" ? "text-black" : "text-white"}`}>
          <div className={`${theme === "light" ? "text-[#1DAA61]" : "text-white"}`}>
            <Logo />
          </div>
          <div className="flex-center gap-8">
            <NewChatIcon />
            <MenuIcon />
          </div>
        </div>

        <div className="w-full h-[calc(100%-10%)] max-h-[calc(100%-10%)] flex-center flex-col px-3 py-2">
          {/** INPUT */}
          <div className="w-full h-[calc(100%-90%)]">
            <Input />
          </div>

          {/** CHATlIST */}
          <div className="w-full h-[calc(100%-10%)] max-h-[calc(100%-10%)] overflow-y-auto overflow-x-hidden">
            <ChatList />
          </div>
        </div>
      </div>

      {/** -----SEPARATOR----- */}
      <div
        className={`w-[0.5px] h-full ${theme === "light" ? "bg-[#DEDCDA]" : "bg-hoverDarkBg"}`}
      ></div>

      {/** RIGHT SIDE */}
      <div className="basis-[calc(100%-30%)] max-w-[calc(100%-30%)] h-full">
        {isChatSelected ? <ChatBox /> : <Advertise />}
      </div>
    </div>
  );
};

export default ChatPage;
