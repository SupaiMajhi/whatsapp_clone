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
    <div className={`relative custom-container ${theme === "light" ? "bg-light text-dark" : "bg-dark text-white"}`}>

      {/** Mobile */}
      <div className="mobile-container">
        <h1 className="mobile-header mb-2">Chats</h1>

        <div className="input-container px-0">
          <Input placeholder="Search a chat" />
        </div>

        {/** todo: render a default component if chatlist length is 0 */}
        <ChatList />
      </div>


      {/** Laptop */}
      <div className="chat-laptop">
        <div className="chat_left">
          <div
            className={`chat_header ${theme === "light" ? "text-black" : "text-white"}`}
          >
            <div
              className={`${theme === "light" ? "text-[#1DAA61]" : "text-white"}`}
            >
              <Logo className="w-28" />
            </div>
            <div className="flex-center gap-3">
              <NewChatIcon
                className="nav-icon"
                onClick={() => setShowNewChat(true)}
              />
              <MenuIcon className="nav-icon" />
            </div>
          </div>

          <div className="chat-main">
            <div className="input-container">
              <Input placeholder="Search a chat" />
            </div>

            <div className="chatlist-container">
              <ChatList />
            </div>
          </div>
        </div>

        <Separator className="w-0.5 h-full" />

        <div className="chat_right">
          {isChatSelected ? <ChatBox /> : <Advertise />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
