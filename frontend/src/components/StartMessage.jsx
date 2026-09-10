import { formatMessageTime } from "../utils/util.js";

//store imports
import useGlobalStore from "../store/globalStore.js";

const StartMessage = ({ message, ref }) => {

    const theme = useGlobalStore((state) => state.theme);

    return (
        <div
            className="chat chat-start"
            ref={ref}
            data-read={message.messageStatus}
            data-id={message._id}
        >
            <div
            className={`chat-bubble flex justify-center items-center gap-2 rounded-r-[10px] rounded-tl-[10px] ${theme === "light" ? "bg-white text-black" : "bg-[#242626] text-white"}`}
            >
            {/** main content */}
            <div className="text-sm font-normal tracking-wide">
                {message?.content}
            </div>
            {/** time */}
            <div className="mt-3 text-xs">
                {message?.readAt ? (
                <p>{formatMessageTime(message?.readAt)}</p>
                ) : message?.deliveredAt ? (
                <p>{formatMessageTime(message?.deliveredAt)}</p>
                ) : message?.createdAt ? (
                <p>{formatMessageTime(message?.createdAt)}</p>
                ) : (
                <p>...</p>
                )}
            </div>
            </div>
        </div>
    )
}

export default StartMessage;