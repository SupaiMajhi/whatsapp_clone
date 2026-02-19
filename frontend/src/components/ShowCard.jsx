import { formatMessageTime } from "../lib.js";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//store imports
import useMessageStore from "../store/messageStore.js";
import useUserStore from "../store/userStore.js";
import useAppStore from "../store/appStore.js";
import useGlobalStore from "../store/globalStore.js";


const ShowCard = ({ chatInfo }) => {

  const fetchAllMessage = useMessageStore((state) => state.fetchAllMessage);
  const getUserStatus = useUserStore((state) => state.getUserStatus);
  const setCurrentRcvr = useAppStore((state) => state.setCurrentRcvr)
  const setIsChatSelected = useAppStore((state) => state.setIsChatSelected);
  const theme = useGlobalStore((state) => state.theme);

  const handleOnClick = async () => {
    setCurrentRcvr(chatInfo?.otherUser);
    setIsChatSelected(true);
    await fetchAllMessage(chatInfo._id);
    await getUserStatus(chatInfo.otherUser._id);
  }

  return (
    <div
      className={`w-full h-20 max-h-20 flex justify-center items-center gap-3 pl-2 ${theme === "light" ? "bg-light text-txtDark hover:bg-hoverLightBg" : "bg-dark text-txtLight hover:bg-hoverDarkBg"} transition-colors duration-75 ease-in rounded-2xl cursor-pointer`}
      onClick={handleOnClick}
    >
      {/** AVATAR */}
      <div className="w-16 h-16 flex justify-center items-center">
        {chatInfo?.otherUser?.profilePic ? (
          <Avatar className="w-full" src={chatInfo.otherUser.profilePic} />
        ) : (
          <AccountCircleIcon
            className={`text-[64px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
          />
        )}
      </div>

      {/** MIDDLE PART */}
      <div className="grow h-full flex flex-col justify-center gap-1 pr-3">
        <div className="w-full flex">
          <div className="grow">
            <h1 className={`text-xl ${theme === "light" ? "text-black" : "text-white"} tracking-wide`}>{chatInfo?.otherUser?.username}</h1>
          </div>
          <div className={`w-fit max-w-28 text-xs font-medium tracking-wider`}>
            <p>{formatMessageTime(chatInfo?.createdAt)}</p>
          </div>
        </div>

        <div className="w-full flex items-center gap-2">
          <div>
            <p className="text-base">??</p>
          </div>
          <div><p className={`text-base ${theme === "light" ? "text-[#666666]" : "text-[#A2A295]"}`}>{chatInfo?.lastMessagePreview?.content}</p></div>
        </div>
      </div>
    </div>
  );
}

export default ShowCard;