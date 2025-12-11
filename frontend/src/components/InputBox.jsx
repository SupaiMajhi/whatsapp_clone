import PlusIcon from "../assets/PlusIcon";
import StickerIcon from "../assets/StickerIcon";
import ArrowIcon from "../assets/ArrowIcon";
import Button from '../components/Button';
import { useState } from "react";

//store imports
import useMessageStore from "../store/messageStore.js";
import useUserStore from "../store/userStore.js";

const InputBox = () => {


  const [msgText, setMsgText] = useState('');
  const sendAMessage = useMessageStore((state) => state.sendAMessage);
  const currentRcvr = useUserStore((state) => state.currentRcvr);

  const handleOnSubmit = async () => {
    await sendAMessage(currentRcvr._id, msgText);
    setMsgText('');
  }
  return (
    <div className="absolute bottom-5 min-w-[calc(100%-2em)] max-w-[calc(100%-1.5em)] min-h-12 max-h-14 flex items-center gap-4 bg-secondaryClr/50 rounded-4xl pl-4 mx-auto"> 
      <div className="flex justify-center items-center gap-5">
        <PlusIcon className='icon text-white' />
        <StickerIcon className='icon text-white' />
      </div>
      <div className="grow">
        <input type="text" name="text" value={msgText} placeholder="Type a message" className="w-full h-full outline-0 text-[1rem] font-semibold" onChange={(e) => setMsgText(e.target.value)} />
      </div>
      <Button handleOnClick={handleOnSubmit}>
        <ArrowIcon className='icon text-white bg-LogoGreen rounded-full w-full h-full p-2' />
      </Button>
    </div>
  )
}

export default InputBox;