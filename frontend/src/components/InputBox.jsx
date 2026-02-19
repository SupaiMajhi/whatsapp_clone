import PlusIcon from "../assets/PlusIcon";
import StickerIcon from "../assets/StickerIcon";
import ArrowIcon from "../assets/ArrowIcon";
import Button from "./PrimaryButton.jsx";
import { useState } from "react";

//store imports
import useMessageStore from "../store/messageStore.js";
import useUserStore from "../store/userStore.js";
import useGlobalStore from "../store/globalStore.js";

const InputBox = () => {
  const [msgText, setMsgText] = useState("");
  const sendAMessage = useMessageStore((state) => state.sendAMessage);
  const currentRcvr = useUserStore((state) => state.currentRcvr);
  const theme = useGlobalStore((state) => state.theme);

  const handleOnSubmit = async () => {
    await sendAMessage(currentRcvr._id, msgText);
    setMsgText("");
  };
  return (
    <div className={`absolute bottom-5 w-[calc(100%-5%)] flex justify-center items-center gap-2 px-4 rounded-4xl ${theme === "light" ? "bg-hoverLightBg" : "bg-hoverDarkBg"}`}>
      <div className="flex justify-center items-center gap-5">
        <PlusIcon className="icon text-white" />
        <StickerIcon className="icon text-white" />
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
      <Button handleOnClick={handleOnSubmit}>
        <ArrowIcon className="icon text-white bg-LogoGreen rounded-full w-full h-full p-2" />
      </Button>
    </div>
  );
};

export default InputBox;
