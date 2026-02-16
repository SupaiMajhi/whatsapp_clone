import Logo from "../assets/Logo";
import NewChatIcon from "../assets/NewChatIcon";
import MenuIcon from "../assets/MenuIcon";
import Input from "../components/Input";
import ChatList from "../components/ChatList";
import { useState, useEffect } from "react";
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
      <div className={`basis-[calc(100%-70%)] max-w-[calc(100%-70%)] h-full flex-center p-5 flex-col ${theme === "light" ? "bg-light text-dark" : "bg-dark text-white"}`}>
        <div className="w-full h-[calc(100%-80%)] max-h-[calc(100%-80%)] flex-center flex-col gap-5">
          <div className={`w-full flex items-center justify-between ${theme === "light" ? "text-black" : "text-white"}`}>
            <div className={`${theme === "light" ? "text-[#1DAA61]" : "text-white"}`}>
              <Logo />
            </div>
            <div className="flex-center gap-8">
              <NewChatIcon  />
              <MenuIcon  />
            </div>
          </div>

          {/** INPUT */}
          <div className="w-full mb-10">
            <Input />
          </div>
        </div>

        {/** CHATlIST */}
        <div className="h-[calc(100%-20%)] max-h-[calc(100%-20%)] overflow-y-auto overflow-x-hidden">
          <ChatList />
        </div>
      </div>

      {/** -----SEPARATOR----- */}
      <div className={`w-[0.5px] h-full ${theme === "light" ? "bg-[#DEDCDA]" : "bg-[#2E2F2F]"}`}></div>

      {/** RIGHT SIDE */}
      <div className="basis-[calc(100%-30%)] max-w-[calc(100%-30%)] h-full">
        {isChatSelected ? <ChatBox /> : <Advertise />}
      </div>
    </div>
  );
};

export default ChatPage;
