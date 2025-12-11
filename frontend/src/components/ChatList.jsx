import ShowCard from "./ShowCard";
import useUserStore from "../store/userStore.js";
import { useState } from "react";

const ChatList = ({ setIsChatSelected }) => {

  const prevChatList = useUserStore((state) => state.prevChatList);

  return (
    <div className='w-full h-full'>
      { prevChatList.map((chat) => (
        <ShowCard key={chat.otherUser._id} chatInfo={chat} setIsChatSelected={setIsChatSelected} />
      ))}
    </div>
  )
}

export default ChatList;