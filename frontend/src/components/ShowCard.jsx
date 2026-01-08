import Avatar from "./Avatar";
import { validateTime } from "../lib.js";
import { MdOutlineImage } from "react-icons/md";

//store imports
import useMessageStore from "../store/messageStore.js";
import useUserStore from "../store/userStore.js";

const ShowCard = ({ chatInfo, setIsChatSelected }) => {

  const fetchAllMessage = useMessageStore((state) => state.fetchAllMessage);
  const getUserStatus = useUserStore((state) => state.getUserStatus);
  const setCurrentRcvr = useUserStore((state) => state.setCurrentRcvr)

  const handleOnClick = async () => {
    setCurrentRcvr(chatInfo.otherUser);
    setIsChatSelected(true);
    await fetchAllMessage(chatInfo._id);
    await getUserStatus(chatInfo.otherUser._id);
  }

  return (
    <div
      className={`w-full max-h-20 flex items-center gap-3 px-2 py-4 cursor-pointer rounded-2xl hover:bg-secondaryClr`}
      onClick={handleOnClick}
    >
      {/** AVATAR */}
      <div className="w-14">
        <Avatar className="w-full" url={chatInfo.otherUser.profilePic} />
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