
//store imports
import useAuthStore from "../store/auth/authStore.js";
import useMessageStore from "../store/messageStore.js";
import useSocketStore from "../store/socketStore.js";
import useGlobalStore from "../store/globalStore.js";

const MainContent = () => {

  const messages = useMessageStore((state) => state.messages);
  const userInfo = useAuthStore((state) => state.userInfo);
  const theme = useGlobalStore((state) => state.theme);

  console.log(messages)
  console.log(userInfo)

  return (
    <div className={`w-full h-full flex flex-col px-18 pt-5 pb-8 text-sm overflow-x-hidden overflow-y-auto ${theme === "light" ? "text-black" : "text-white"}`}>
      {messages.map((message) =>
        message.receiver === userInfo._id ? (
          <div className="chat chat-start">
            <div className={`chat-bubble ${theme === "light" ? "bg-light" : "bg-dark"}`}>
              It's over Anakin,
            </div>
          </div>
        ) : (
          <div className="chat chat-end">
            <div className={`chat-bubble ${theme === "light" ? "bg-lightMyChatclr" : "bg-darkMyChatclr"}`}>You underestimate my power!</div>
          </div>
        ),
      )}
    </div>
  );
};

export default MainContent;
