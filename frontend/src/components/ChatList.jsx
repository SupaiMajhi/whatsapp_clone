import { useEffect } from "react";

import ShowCard from "./ShowCard";

// Store imports
import useUserStore from "../store/userStore.js";

const ChatList = () => {

  const prevChatList = useUserStore((state) => state.prevChatList);
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
    <div className="custom-container">
      {prevChatList?.length > 0 ? (
        prevChatList.map((chat) => <ShowCard key={chat._id} chatInfo={chat} />)
      ) : (
        <p>No conversation yet.</p>
      )}
    </div>
  );
}

export default ChatList;