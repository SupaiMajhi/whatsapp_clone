import { useState, useEffect } from "react";
import { motion } from "motion/react";

//store imports
import useGlobalStore from "../store/globalStore.js";
import useUserStore from "../store/userStore.js";
import useMessageStore from "../store/messageStore.js";
import useAppStore from "../store/appStore.js";

//components imports
import Input from "./Input.jsx";
import BackButton from "../assets/Back.jsx";
import Avatar from "../components/Avatar.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const NewChat = ({ setShowNewChat }) => {
  const theme = useGlobalStore((state) => state.theme);
  const searchUser = useUserStore((state) => state.searchUser);
  const fetchFirstPage = useMessageStore((state) => state.fetchFirstPage);
  const getUserStatus = useUserStore((state) => state.getUserStatus);
  const setCurrentOpenConversation = useUserStore(
    (state) => state.setCurrentOpenConversation,
  );
  const setCurrentRcvr = useAppStore((state) => state.setCurrentRcvr);
  const setIsChatSelected = useAppStore((state) => state.setIsChatSelected);
  const [searchRslt, setSearchRslt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function fetchUser(phone){
      setLoading(true);
      setSearchRslt(await searchUser(phone));
      setLoading(false);
    }

    if(phone.length === 10){
      fetchUser(phone);
    }
  }, [phone])
  
  const handleClick = async () => {
    setCurrentRcvr(searchRslt.user);
    setCurrentOpenConversation({
      userId: searchRslt.user?._id,
      conversationId: null,
    });
    setIsChatSelected(true);
    setShowNewChat(false);
    await fetchFirstPage(searchRslt.user?._id);
    await getUserStatus(searchRslt.user?._id);
  };

  return (
    <motion.div
      className={`absolute z-20 inset-0 left-container ${theme === "dark" ? "bg-dark" : "bg-light"}`}
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ ease: "easeInOut", duration: 0.25 }}
    >
      <div className="w-full flex items-center gap-2 mb-5">
        <BackButton
          className="nav-icon"
          onClick={() => setShowNewChat(false)}
        />
        <h1 className="text-base font-normal">New chat</h1>
      </div>

      {/**----- Input ------*/}
      <div className="w-full mb-10">
        <Input
          placeholder="Search number"
          value={phone}
          handleOnChange={(e) => setPhone(e.target.value)}
          isLoading={loading}
        />
      </div>

      {/**----- Results ------*/}
      <div className="w-full bg-inherit">
        {searchRslt?.user ? (
          Object.keys(searchRslt.user)?.length > 0 ? (
            <div
              onClick={handleClick}
              className={`c ${theme === "light" ? "bg-light text-txtDark hover:bg-hoverLightBg" : "bg-dark text-txtLight hover:bg-hoverDarkBg"}`}
            >
              {/**----- Avatar -------*/}
              <div className="w-14 h-14 flex justify-center items-center mr-2">
                {searchRslt.user?.profilePic ? (
                  <Avatar className="w-full" url={searchRslt.user?.profilePic} />
                ) : (
                  <AccountCircleIcon
                    className={`text-[56px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
                  />
                )}
              </div>

              {/**----- phone ------*/}
              <h1
                className={`text-base tracking-wide ${theme === "light" ? "text-black" : "text-white"}`}
              >
                {searchRslt.user?.phone}
              </h1>
            </div>
          ) : (
            <div className="w-full h-full flex jusitfy-center items-start">
              <p className="w-full text-center text-sm">
                {searchRslt?.message}
              </p>
            </div>
          )
        ) : null}
      </div>
    </motion.div>
  );
};

export default NewChat;
