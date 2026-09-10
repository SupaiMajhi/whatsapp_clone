//components imports
import ChatBox from "../../components/ChatBox.jsx";
import Advertise from "../Advertise.jsx";

//store imports
import useAppStore from "../../store/appStore.js";

const RightSide = ({ isFirstPage }) => {

  const isChatSelected = useAppStore((state) => state.isChatSelected);

  return (
    <div className="size-full">
      {isChatSelected ? (
        <ChatBox isFirstPage={isFirstPage} />
      ) : (
        <Advertise />
      )}
    </div>
  )
}

export default RightSide