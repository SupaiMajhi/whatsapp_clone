import { AnimatePresence } from "motion/react";
import { useState } from "react";

//component imports
import LeftSide from "./LeftSide.jsx";
import RightSide from "./RightSide.jsx";
import Separator from "../../components/Separator.jsx";

//store imports
import useGlobalStore from "../../store/globalStore.js";

const ChatPage = () => {
  const theme = useGlobalStore((state) => state.theme);
  const [showNewChat, setShowNewChat] = useState(false);

  return (
    <div className={`custom-container ${theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}>

      {/** Left Side */}
      <div className="chat_left">
        <LeftSide />
      </div>

      {/** Separator */}
      <Separator />

      {/** Right Side */}
      <div className="flex-1 h-full bg-blue-800">
        <RightSide />
      </div>
    </div>
  );
};

export default ChatPage;
