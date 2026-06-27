import { AnimatePresence } from "motion/react";
import { useState } from "react";

//component imports
import Logo from "../assets/TextLogo.jsx";
import NewChatIcon from "../assets/NewChatIcon";
import MenuIcon from "../assets/MenuIcon";
import Input from "../components/Input";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import Advertise from "./Advertise";
import Separator from "../components/Separator.jsx";

//store imports
import useGlobalStore from "../store/globalStore.js";
import useAppStore from "../store/appStore.js";
import NewChat from "../components/NewChat.jsx";

const ChatPage = () => {
  const theme = useGlobalStore((state) => state.theme);
  const isChatSelected = useAppStore((state) => state.isChatSelected);

  const [showNewChat, setShowNewChat] = useState(false);

  return (
    <div className="relative custom-container">
      {/** LEFT SIDE */}
      <div
        className={`relative basis-[calc(100%-70%)] max-w-[calc(100%-70%)] h-full py-5 px-2 flex flex-col justify-start items-center select-none ${theme === "light" ? "bg-light text-dark" : "bg-dark text-white"}`}
      >
        {/**----- popup ------*/}
        <AnimatePresence>
          {showNewChat ? (
            <NewChat
              setShowNewChat={setShowNewChat}
            />
          ) : null }
        </AnimatePresence>
        <div
          className={`w-full flex items-center justify-between pl-6 pr-7 mb-4 ${theme === "light" ? "text-black" : "text-white"}`}
        >
          <div
            className={`${theme === "light" ? "text-[#1DAA61]" : "text-white"}`}
          >
            <Logo />
          </div>
          <div className="flex-center gap-8">
            <NewChatIcon className="nav-icon" onClick={() => setShowNewChat(true)} />
            <MenuIcon className="nav-icon" />
          </div>
        </div>

        <div className="w-full h-[calc(100%-10%)] max-h-[calc(100%-10%)] flex-center flex-col px-3 py-2">
          {/** INPUT */}
          <div className="w-full h-[calc(100%-90%)]">
            <Input 
              placeholder="Search a chat"  
            />
          </div>

          {/** CHATlIST */}
          <div className="w-full h-[calc(100%-10%)] max-h-[calc(100%-10%)] overflow-y-auto overflow-x-hidden">
            <ChatList />
          </div>
        </div>
      </div>

      {/** -----SEPARATOR----- */}
      <Separator />

      {/** RIGHT SIDE */}
      <div className="basis-[calc(100%-30%)] max-w-[calc(100%-30%)] h-full">
        {isChatSelected ? <ChatBox /> : <Advertise />}
      </div>
    </div>
  );
};

export default ChatPage;
