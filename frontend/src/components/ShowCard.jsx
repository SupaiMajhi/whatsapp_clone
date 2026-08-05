import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { formatChatTime } from "../utils/util.js";

//store imports
import useMessageStore from "../store/messageStore.js";
import useUserStore from "../store/userStore.js";
import useAppStore from "../store/appStore.js";
import useGlobalStore from "../store/globalStore.js";


const ShowCard = ({ chatInfo }) => {

  const fetchAllMessage = useMessageStore((state) => state.fetchAllMessage);
  const getUserStatus = useUserStore((state) => state.getUserStatus);
  const setCurrentOpenConversation = useUserStore((state) => state.setCurrentOpenConversation);
  const setCurrentRcvr = useAppStore((state) => state.setCurrentRcvr)
  const setIsChatSelected = useAppStore((state) => state.setIsChatSelected);
  const theme = useGlobalStore((state) => state.theme);
  const userInfo = useAppStore((state) => state.userInfo);

  const handleOnClick = async () => {
    setCurrentRcvr(chatInfo?.otherUser);
    setCurrentOpenConversation({
      userId: null,
      conversationId: chatInfo._id,
    });
    setIsChatSelected(true);
    await fetchAllMessage(chatInfo._id);
    await getUserStatus(chatInfo.otherUser._id);
  }

  return (
    <div
      className={`chatlist ${theme === "light" ? "bg-light text-txtDark hover:bg-hoverLightBg" : "bg-dark text-txtLight hover:bg-hoverDarkBg"} transition-colors duration-75 ease-in rounded-2xl cursor-pointer`}
      onClick={handleOnClick}
    >
      {/** AVATAR */}
      <div className="w-14 h-14 flex justify-center items-center">
        {chatInfo?.otherUser?.profilePic ? (
          <Avatar className="w-full" src={chatInfo.otherUser.profilePic} />
        ) : (
          <AccountCircleIcon
            className={`text-[60px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
          />
        )}
      </div>

      {/** MIDDLE PART */}
      <div className="grow h-full flex flex-col justify-center gap-1 pr-3">
        <div className="w-full flex">
          <div className="grow">
            <h1
              className={`text-base font-normal ${theme === "light" ? "text-black" : "text-white"} tracking-wide`}
            >
              {chatInfo?.otherUser?.username}
            </h1>
          </div>
          <div className={`w-fit max-w-28 text-xs font-normal tracking-wider`}>
            <p>{formatChatTime(chatInfo?.lastMessage?.createdAt)}</p>
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="flex-center gap-1">
            {userInfo.id === chatInfo?.lastMessage?.sender && (
              <div className="text-base">
                {chatInfo?.lastMessage?.messageStatus === "seen" ? (
                  <p>
                    <IoCheckmarkDoneSharp className="text-blue-500" />
                  </p>
                ) : chatInfo?.lastMessage?.messageStatus === "delivered" ? (
                  <p>
                    <IoCheckmarkDoneSharp />
                  </p>
                ) : chatInfo?.lastMessage?.messageStatus === "pending" ? (
                  <p>
                    <FaRegClock />
                  </p>
                ) : (
                  <p>
                    <IoCheckmarkSharp />
                  </p>
                )}
              </div>
            )}
            <div>
              <p
                className={`text-sm font-medium ${theme === "light" ? "text-[#666666]" : "text-[#A2A295]"}`}
              >
                {chatInfo?.lastMessage?.content?.length >= 40
                  ? chatInfo?.lastMessage?.content?.slice(0, 40) + "...."
                  : chatInfo?.lastMessage?.content}
              </p>
            </div>
          </div>

          {chatInfo?.unreadCount > 0 && (
            <p className="size-7 p-1 rounded-full bg-green-800 flex-center text-xs font-medium text-white">{chatInfo?.unreadCount}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowCard;
