import Logo from "../assets/Logo";
import NewChatIcon from "../assets/NewChatIcon";
import MenuIcon from "../assets/MenuIcon";
import Input from "../components/Input";
import ChatList from "../components/ChatList";
import { useState, useEffect } from "react";
import ChatBox from "../components/ChatBox";
import Advertise from "./Advertise";

//store imports


const ChatPage = ({ isChatSelected, setIsChatSelected }) => {

  return (
    <div className="relative w-full h-full flex">
      {/** LEFT SIDE */}
      <div className="bg-primaryBg/70">
        <div className="chat-left-container py-4 px-[1.15em]">
          <div className="flex justify-between items-center mb-7">
            <div>
              <Logo />
            </div>
            <div className="flex justify-center items-center gap-5">
              <NewChatIcon className="cursor-pointer" />
              <MenuIcon className="cursor-pointer" />
            </div>
          </div>

          {/** INPUT */}
          <div className="w-full mb-10">
            <Input className="input-field" />
          </div>
        </div>

        {/** CHATlIST */}
        <div className="chat-left-container h-[520px] overflow-y-auto overflow-x-hidden px-2">
          <ChatList setIsChatSelected={setIsChatSelected} />
        </div>
      </div>

      {/** RIGHT SIDE */}
      <div className="right-container bg-primaryBg">
        {isChatSelected ? <ChatBox /> : <Advertise />}
      </div>
    </div>
  );
};

export default ChatPage;
