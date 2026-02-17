import { validateTime } from "../lib.js";
import { MdOutlineImage } from "react-icons/md";
import Avatar from "@mui/material/Avatar";

//store imports
import useMessageStore from "../store/messageStore.js";
import useUserStore from "../store/userStore.js";
import useAppStore from "../store/appStore.js";
import useGlobalStore from "../store/globalStore.js";


const ShowCard = () => {

  const fetchAllMessage = useMessageStore((state) => state.fetchAllMessage);
  const getUserStatus = useUserStore((state) => state.getUserStatus);
  const setCurrentRcvr = useUserStore((state) => state.setCurrentRcvr)
  const setIsChatSelected = useAppStore((state) => state.setIsChatSelected);
  const theme = useGlobalStore((state) => state.theme);

  const handleOnClick = async () => {
    setCurrentRcvr(chatInfo.otherUser);
    setIsChatSelected(true);
    await fetchAllMessage(chatInfo._id);
    await getUserStatus(chatInfo.otherUser._id);
  }

  return (
    <div
      className={`card ${theme === "light" ? "bg-inherit hover:bg-lightNav transition-colors duration-75 ease-in" : "bg-inherit hover:bg-darkNav transition-colors duration-75 ease-in"}`}
      onClick={handleOnClick}
    >
      {/** AVATAR */}
      <div className="w-14">
        <Avatar className="w-full" src={chatInfo.otherUser.profilePic} />
      </div>

      {/** MIDDLE PART */}
      <div className="flex justify-between items-start">
        <div className="w-[280px] grow">
          <h2 className="box-heading">{chatInfo.otherUser.username}</h2>
          <p className="text">
            {chatInfo.lastMessagePreview.contentType === "image" ? 
              chatInfo.lastMessagePreview.content ? 
                <span>{chatInfo.lastMessagePreview.content}</span>
               : 
                <span>{<MdOutlineImage />} Photo</span>
              
             : (
              <span>{chatInfo.lastMessagePreview.content}</span>
            )}
          </p>
        </div>
        <div className="w-[70px]">
          <p className="time-text">
            {validateTime(chatInfo.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShowCard;