import PlusIcon from "../assets/PlusIcon";
import StickerIcon from "../assets/StickerIcon";
import ArrowIcon from "../assets/ArrowIcon";
import { useState } from "react";

//store imports
import useMessageStore from "../store/messageStore.js";
import useAppStore from "../store/appStore.js";
import useSocketStore from "../store/socketStore.js";
import useGlobalStore from "../store/globalStore.js";

const InputBox = () => {
  
  const [msgText, setMsgText] = useState("");
  const currentRcvr = useAppStore((state) => state.currentRcvr);
  const send_message = useSocketStore((state) => state.send_message);
  const theme = useGlobalStore((state) => state.theme);

  const handleOnSubmit = async () => {
    //change the sendAMesage handler in messageStore
    await send_message(currentRcvr._id, { content: msgText, content_type: "text" });
    setMsgText("");
  };

  return (
    <div className={`absolute bottom-1 w-[calc(100%-1%)] h-12 flex justify-center items-center gap-2 px-2 rounded-4xl ${theme === "light" ? "bg-hoverLightBg" : "bg-hoverDarkBg"}`}>
      <div className="flex justify-center items-center gap-2">
        <PlusIcon className="nav-icon" />
        <StickerIcon className="nav-icon" />
      </div>
      <div className="grow">
        <input
          type="text"
          name="text"
          value={msgText}
          placeholder="Type a message"
          autoComplete="off"
          className="w-full h-full outline-0 text-[1rem] font-semibold"
          onChange={(e) => setMsgText(e.target.value)}
        />
      </div>
      <button onClick={handleOnSubmit}>
        <ArrowIcon className="icon text-white bg-LogoGreen rounded-full w-full h-full p-2" />
      </button>
    </div>
  );
};

export default InputBox;
