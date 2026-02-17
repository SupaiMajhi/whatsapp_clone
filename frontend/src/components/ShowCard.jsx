import { validateTime } from "../lib.js";
import { MdOutlineImage } from "react-icons/md";
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
      className={`w-full h-20 max-h-20 flex justify-center items-center gap-3 pl-3`}
      onClick={handleOnClick}
    >
      {/** AVATAR */}
      <div className="w-16 h-16 flex justify-center items-center">
        {chatInfo?.otherUser?.profilePic ? (
          <Avatar className="w-full" src={chatInfo.otherUser.profilePic} />
        ) : (
          <AccountCircleIcon
            className={`text-[64px]! ${theme === "light" ? "text-txtLight" : "text-txtDark"}`}
          />
        )}
      </div>

      {/** MIDDLE PART */}
      <div className="grow h-full flex flex-col justify-center gap-1 pr-3">
        <div className="w-full flex">
          <div className="grow">
            <h1>Sameer(You)</h1>
          </div>
          <div className="w-fit max-w-28 bg-amber-400">12.30</div>
        </div>

        <div className="w-full flex items-center gap-2">
          <div><p>??</p></div>
          <div><p>hello, what are you doing?</p></div>
        </div>
      </div>
    </div>
  );
}

export default ShowCard;