import { sendMessageViaSocket } from "../utils/util.js";

//store imports
import useUserStore from "../store/userStore.js";
import useMessageStore from "../store/messageStore.js";
import useAuthStore from "../store/authStore.js";

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
  const messagesIds = [];
  const { chatList, currentOpenConversation } = useUserStore.getState();
  const { newMsg: lastMessage, conversation } = data;
  const unreadCount = data.conversation.unreadCount;

  const found = chatList.find((c) => c._id === conversation._id);

  let visible = currentOpenConversation.conversationId
    ? currentOpenConversation.conversationId === conversation._id
    : currentOpenConversation.userId === lastMessage.sender;
  if (visible) {
    if (found) {
      const newChatList = [
        { ...found, lastMessage },
        ...chatList.filter((c) => c._id !== conversation._id),
      ];

      useUserStore.setState({ chatList: newChatList });
    }
    useMessageStore.getState().setMessages(lastMessage);
  } else {
    if (found) {
      //found = true, and user is sender
      if (lastMessage.sender === useAuthStore.getState()?.userInfo?._id) {
        const newChatList = [
          { ...found, lastMessage },
          ...chatList.filter((c) => c._id !== found._id),
        ];

        useUserStore.setState({ chatList: newChatList });
      } else {
        //found = true, and user is receiver
        const newChatList = [
          { ...found, lastMessage, unreadCount },
          ...chatList.filter((c) => c._id !== conversation._id),
        ];

        useUserStore.setState({ chatList: newChatList });
      }
    } else {
      //if chatList not found
      useUserStore.setState({ chatList: [conversation, ...chatList] });
      useMessageStore.getState().setMessages(lastMessage);
    }
  }
  messagesIds.push(lastMessage._id);
  sendMessageViaSocket("markAsDelivered", {
    data: {
      messagesIds,
      conversationId: found._id,
    },
  });
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
