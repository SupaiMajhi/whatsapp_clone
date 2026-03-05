import { useEffect } from "react";

import ShowCard from "./ShowCard";

// Store imports
import useUserStore from "../store/userStore.js";

const 
ChatList = () => {

  const chatList = useUserStore((state) => state.chatList);
  const isLoading = useUserStore((state) => state.isLoading);
  const getPrevChatList = useUserStore((state) => state.getPrevChatList);

  useEffect(() => {
    async function fetch() {
      await getPrevChatList();
    }
    fetch();
  }, []);
  
  if (isLoading) {
    <div className="custom-container">
      <span className="loading loading-spinner loading-sm"></span>
    </div>;
  }
  
  return (
    <div className="w-full h-full flex items-center flex-col">
      {chatList?.length > 0 ? (
        chatList.map((chat) => <ShowCard key={chat._id} chatInfo={chat} />)
      ) : (
        <div className="custom-container">
          <p>No conversation yet.</p>
        </div>
      )}
    </div>
  );
}

export default ChatList;