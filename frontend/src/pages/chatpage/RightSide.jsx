//components imports
import ChatBox from "../../components/ChatBox.jsx";
import Advertise from "../Advertise.jsx";

//store imports
import useAppStore from "../../store/appStore.js";

const RightSide = () => {

  const isChatSelected = useAppStore((state) => state.isChatSelected);

  return (
    <div className="size-full">
      {isChatSelected ? (
        <ChatBox />
      ) : (
        <Advertise />
      )}
    </div>
  )
}

export default RightSide