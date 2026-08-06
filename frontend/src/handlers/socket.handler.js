import { sendMessageViaSocket } from "../utils/util.js";

//store imports
import useUserStore from "../store/userStore.js";
import useMessageStore from "../store/messageStore.js";
import useAuthStore from "../store/authStore.js";
import useSocketStore from "../store/socketStore.js";
import useAppStore from "../store/appStore.js";

export const handleOnOfflineMsg = (data) => {
  const messagesIds = [];
  data.forEach((d) => {
    const { chatList } = useUserStore.getState();
    const lastMessage = d.messages.at(-1);
    const unreadCount = d.messages.length;

    const found = chatList.find((c) => c._id === d._id);
    if (found) {
      useUserStore.setState((state) => {
        return {
          chatList: [
            { ...found, lastMessage, unreadCount },
            ...state.chatList.filter((c) => c._id !== found._id),
          ],
        };
      });
    }
    //send delivery ack
    d.messages.forEach((m) => messagesIds.push(m._id));
    sendMessageViaSocket("markAsDelivered", { data: messagesIds });
  });
};

export const handleOnNewMsg = (data) => {
  const { socket } = useSocketStore.getState();
  const { userInfo } = useAppStore.getState();
  const { chatList, currentOpenConversation } = useUserStore.getState();
  const { newMsg, conversation } = data;
  const unreadCount = data.conversation.unreadCount;

  let visible = currentOpenConversation.conversationId === conversation._id ? true : false;
  if (visible) {
    useMessageStore.setState((state) => ({
      messages: [...state.messages, newMsg]
    }));
    useUserStore.setState((state) => ({
      chatList: state.chatList.map(c => c._id === conversation._id ? {
        ...c,
        lastMessage: newMsg
      } : c)
    }));
  } else {
    useUserStore.setState((state) => ({
      chatList: state.chatList.map(c => c._id === conversation._id ? {
        ...c,
        lastMessage: newMsg
      } : c)
    }));
  }
  if(userInfo?.id === newMsg.receiver) {
    if (socket?.readyState === WebSocket.OPEN) {
      socket?.send(
        JSON.stringify({
          type: "markAsDelivered",
          payload: {
            message_id: [newMsg._id],
            deliveredAt: Date.now(),
          },
        }),
      );
    }
  }
};

export const handleDeliveredMsg = (data) => {
  useUserStore.setState((state) => ({
    chatList: state.chatList.map(c => c._id === data.conversationId ? 
      { 
        ...c, 
        lastMessage: {
          ...c.lastMessage,
          messageStatus: data.messageStatus,
          deliveredAt: data.deliveredAt,
        } 
      } 
      : c
    )
  }))
  if (useUserStore.getState().currentOpenConversation.conversationId === data.conversationId) {
    useMessageStore.setState((state) => ({
      messages: state.messages.map((m) =>
        m._id === data.id
          ? {
              ...m,
              messageStatus: data.messageStatus,
              deliveredAt: data.deliveredAt,
            }
          : m,
      ),
    }));
  }
};

export const handleSeenMsg = (data) => {
  if (useUserStore.getState().currentOpenConversation.conversationId === data.conversationId) {
    useMessageStore.setState((state) => ({
      messages: state.messages.map((m) =>
        m._id === data.id
          ? { ...m, messageStatus: data.messageStatus, seenAt: data.seenAt }
          : m,
      ),
    }));
  }
};
