import ShowCard from "./ShowCard";
import useUserStore from "../store/userStore.js";
import { useState } from "react";

const ChatList = () => {

  const prevChatList = useUserStore((state) => state.prevChatList);

  return (
    <div className='w-full h-full'>
      { prevChatList.map((chat) => (
        <ShowCard key={chat._id} chatInfo={chat} />
      ))}
    </div>
  )
}

export default ChatList;