import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";

import { formatMessageTime } from "../utils/util.js";

//store imports
import useGlobalStore from "../store/globalStore.js";

const EndMessage = ({ message, ref }) => {

    const theme = useGlobalStore((state) => state.theme);

    return (
        <div 
            className="chat chat-end"
            ref={ref}
        >
            <div
            className={`chat-bubble flex justify-center items-center gap-2 rounded-l-[10px] rounded-tr-[10px] ${theme === "light" ? "bg-lightMyChatclr text-black" : "bg-darkMyChatclr text-white"}`}
            >
            {/** main content */}
            <div className="text-sm font-normal tracking-wide">
                {message?.content}
            </div>
            {/** time and status */}
            <div className="flex justify-center items-center gap-1 mt-3 text-xs">
                {/** time */}
                {message?.readAt ? (
                <p>{formatMessageTime(message?.readAt)}</p>
                ) : message?.deliveredAt ? (
                <p>{formatMessageTime(message?.deliveredAt)}</p>
                ) : message?.createdAt ? (
                <p>{formatMessageTime(message?.createdAt)}</p>
                ) : (
                <p></p>
                )}
                {/** status */}
                {message?.messageStatus === "read" ? (
                <p>
                    <IoCheckmarkDoneSharp className="text-blue-500" />
                </p>
                ) : message?.messageStatus === "delivered" ? (
                <p>
                    <IoCheckmarkDoneSharp />
                </p>
                ) : message?.messageStatus === "pending" ? (
                <p>
                    <FaRegClock />
                </p>
                ) : (
                <p>
                    <IoCheckmarkSharp />
                </p>
                )}
            </div>
            </div>
        </div>
    )
}

export default EndMessage;