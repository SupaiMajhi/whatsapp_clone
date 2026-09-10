import { useEffect, useRef } from "react";

import { sendMessageViaSocket } from "../utils/util.js";

//store imports
import useAppStore from "../store/appStore.js";
import useMessageStore from "../store/messageStore.js";
import useGlobalStore from "../store/globalStore.js";
import useUserStore from "../store/userStore.js";
import usePageVisibility from "../hooks/usePageVisibility.js";
import useInfinityScroll from "../hooks/useInfinityScroll.js";

//components imports
import StartMessage from "./StartMessage.jsx";
import EndMessage from "./EndMessage.jsx";
const MainContent = ({ isFirstPage }) => {
  const messages = useMessageStore((state) => state.messages);
  const userInfo = useAppStore((state) => state.userInfo);
  const theme = useGlobalStore((state) => state.theme);
  const currentOpenConversation = useUserStore((state) => state.currentOpenConversation);

  const isVisible = usePageVisibility();
  let { isFetchingNext, rootRef, loader } = useInfinityScroll(currentOpenConversation.conversationId);
  const observerRef = useRef(null);
  const elemRef = useRef(new Set());
  const ref = useRef(null);

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.dataset.read !== "read") {
          sendMessageViaSocket("markAsSeen", {
            data: {
              messagesIds: [entry.target.dataset.id],
              conversationId: currentOpenConversation.conversationId,
            },
          });
        }
      }
      observerRef.current.unobserve(entry.target);
    });
  };

  const setRef = (el, message) => {
    if (!el) return;
    if (!elemRef.current.has(el)) {
      elemRef.current.add(el);
      observerRef.current?.observe(el);
    }
  };

  useEffect(() => {
    if (!isVisible) return;

    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }

    const options = {
      root: rootRef.current,
      threshold: 0.75,
    };

    observerRef.current = new IntersectionObserver(observerCallback, options);
    elemRef.current.forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      observerRef.current.disconnect();
    };
  }, [isVisible, messages]);

  return (
    <div
      ref={rootRef}
      className={`w-full h-full flex flex-col px-18 pt-5 pb-8 text-sm overflow-x-hidden overflow-y-auto ${theme === "light" ? "text-black" : "text-white"}`}
    >
      {/** todo: for now default contentType is "text", in future i will implement other contentType */}
      {!isFirstPage && messages.length > 0 ? (
        <div ref={loader} className="w-full min-h-5"></div>
      ) : null}
      {isFetchingNext ? <p>Loadinnggg......</p> : null}
      {messages.map((message) =>
        message?.contentType === "text" ? (
          message?.receiver === userInfo.id ? (
            <StartMessage
              key={message._id} 
              ref={(el) => setRef(el, message)}
              message={message}
            />
          ) : (
            <EndMessage
              key={message._id} 
              message={message}
            />
          )
        ) : (
          <p key={message._id}>only text type is supported.</p>
        ),
      )}
      <div ref={ref} className="w-full min-h-5"></div>
    </div>
  );
};

export default MainContent;
