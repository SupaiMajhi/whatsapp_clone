import { IoCheckmarkSharp, IoOptions } from "react-icons/io5";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { formatMessageTime } from "../lib.js";
import { useRef, useLayoutEffect, useCallback } from "react";

//store imports
import useAuthStore from "../store/auth/authStore.js";
import useMessageStore from "../store/messageStore.js";
import useSocketStore from "../store/socketStore.js";

const MainContent = () => {
  const messages = useMessageStore((state) => state.messages);
  const user = useAuthStore((state) => state.user);
  const socket = useSocketStore((state) => state.socket);
  const rootRef = useRef(null);
  const observer = useRef(null);
  const messagesIds = useRef(new Set());
  let timer = null;

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        messagesIds.current.add(entry.target.id);
        observer.current.unobserve(entry.target);
      }
    });

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      if (messagesIds.current.length > 0) {
        socket.send(
          JSON.stringify({
            type: "markAsSeen",
            content: {
              data: messagesIds.current,
            },
          }),
        );
        messagesIds.current.clear();
      }
    }, 300);
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    observer.current = new IntersectionObserver(observerCallback, {
      threshold: 0.75,
      root: rootRef.current,
    });

    return () => {
      observer.current.disconnect();
    };
  }, []);

  const setRef = useCallback((el) => {
    if (el && el.getAttribute("data-isseen") === "false") {
      observer.current.observe(el);
    }
  }, []);

  return (
    <div
      className="w-full h-[560px] overflow-x-hidden overflow-y-auto"
      ref={rootRef}
    >
      {messages.map((message) =>
        message.senderId === user._id ? (
          <div className="chat chat-end" key={message._id} id={message._id}>
            <div className="chat-bubble bg-green-900 text flex justify-between items-center gap-2">
              {/* {message.contentType === 'image' || message.contentType === 'video' || message.contentType === 'gif' ?  } */}
              <div className="flex justify-center items-center gap-1 mt-3">
                {message.isSeen ? (
                  <p className="time-text">{formatMessageTime(message.readAt)}</p>
                ) : message.isDelivered ? (
                  <p className="time-text">
                    {formatMessageTime(message.deliveredAt)}
                  </p>
                ) : message.isSent ? (
                  <p className="time-text">{formatMessageTime(message.createdAt)}</p>
                ) : (
                  <p></p>
                )}

                {message.isSeen ? (
                  <IoCheckmarkDoneSharp className="text-blue-400" />
                ) : message.isDelivered ? (
                  <IoCheckmarkDoneSharp className="text-baseClr" />
                ) : message.isSent ? (
                  <IoCheckmarkSharp className="text-baseClr" />
                ) : (
                  <FaRegClock className="text-baseClr" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="chat chat-start"
            key={message._id}
            id={message._id}
            ref={setRef}
            data-isseen={message.isSeen}
          >
            <div className="chat-bubble bg-secondaryClr text">
              {message.text}
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default MainContent;
