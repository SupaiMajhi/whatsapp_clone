import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";

import { formatMessageTime } from "../lib.js";

//store imports
import useAuthStore from "../store/auth/authStore.js";
import useMessageStore from "../store/messageStore.js";
import useSocketStore from "../store/socketStore.js";
import useGlobalStore from "../store/globalStore.js";

const MainContent = () => {
  const messages = useMessageStore((state) => state.messages);
  const userInfo = useAuthStore((state) => state.userInfo);
  const theme = useGlobalStore((state) => state.theme);

  return (
    <div
      className={`w-full h-full flex flex-col px-18 pt-5 pb-8 text-sm overflow-x-hidden overflow-y-auto ${theme === "light" ? "text-black" : "text-white"}`}
    >
      {/** for now default contentType is "text", in future i will implement other contentType */}
      {messages.map((message) =>
        message?.contentType === "text" ? (
          message?.receiver === userInfo._id ? (
            <div className="chat chat-start" key={message?._id}>
              <div className={`chat-bubble flex justify-center items-center gap-2 ${theme === "light" ? "bg-white text-black" : "bg-[#242626] text-white"}`}>
                {/** main content */}
                <div className="text-sm font-normal tracking-wide">{message?.content}</div>
                {/** time */}
                <div className="mt-3 text-xs">
                  {message?.seenAt ? (
                    <p>{formatMessageTime(message?.seenAt)}</p>
                  ) : message?.deliveredAt ? (
                    <p>{formatMessageTime(message?.deliveredAt)}</p>
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="chat chat-end" key={message?._id}>
              <div className={`chat-bubble flex justify-center items-center gap-2 ${theme === "light" ? "bg-lightMyChatclr text-black" : "bg-darkMyChatclr text-white"}`}>
                {/** main content */}
                <div className="text-sm font-normal tracking-wide">{message?.content}</div>
                {/** time and status */}
                <div className="flex justify-center items-center gap-1 mt-3 text-xs">
                  {/** time */}
                  {message?.seenAt ? (
                    <p>{formatMessageTime(message?.seenAt)}</p>
                  ) : message?.deliveredAt ? (
                    <p>{formatMessageTime(message?.deliveredAt)}</p>
                  ) : message?.sentAt ? (
                    <p>{formatMessageTime(message?.sentAt)}</p>
                  ) : (
                    <p></p>
                  )}
                  {/** status */}
                  {message?.messageStatus === 'seen' ? (
                    <p><IoCheckmarkDoneSharp className="text-blue-500" /></p>
                  ) : message?.messageStatus === 'delivered' ? (
                    <p><IoCheckmarkDoneSharp /></p>
                  ) : message?.messageStatus === 'pending' ? (
                    <p><FaRegClock /></p>
                  ) : (
                    <p><IoCheckmarkSharp /></p>
                  )}                
                </div>
              </div>
            </div>
          )
        ) : (
          <p>only type text is supported.</p>
        ),
      )}
    </div>
  );
};

export default MainContent;
