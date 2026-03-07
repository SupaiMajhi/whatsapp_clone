
import useUserStore from "../store/userStore.js"
import useMessageStore from "../store/messageStore.js";
import useAuthStore from "../store/authStore.js";

export const handleOnOfflineMsg = (data) => {
    data.forEach(d => {
        const { chatList } = useUserStore.getState();
        const lastMessage = d.messages.at(-1);
        const unreadCount = d.messages.length;

        const index = chatList.findIndex(c => c._id === d._id);
        if(index !== -1){
            const updatedConversation = {
                ...chatList[index],
                lastMessage,
                unreadCount
            }

            const newChatList = [
                updatedConversation,
                ...chatList.filter(c => c._id !== d._id)
            ];
            useUserStore.setState({ chatList: newChatList });
        }
    });
    //send delivery_ack
}

export const handleOnNewMsg = (data) => {
    
    const { chatList } = useUserStore.getState();
    const lastMessage = data.newMsg;
    const unreadCount = data.conversation.unreadCount;

    const found = chatList.find(c => c._id === data.conversation._id);

    if(useUserStore.getState().currentOpenConversationId === data.conversation._id){
        if(found){

            const newChatList = [
                {...found, lastMessage },
                ...chatList.filter(c => c._id !== data.conversation._id)
            ];

            useUserStore.setState({ chatList: newChatList });
        }
        useMessageStore.getState().setMessages(data.newMsg);
    }else{
        if(found){
            //if found = true, and user is sender
            if(data.newMsg.sender === useAuthStore.getState()?.userInfo?._id){

                const newChatList = [
                    {...found, lastMessage},
                    ...chatList.filter(c => c._id !== found._id)
                ];

                useUserStore.setState({ chatList: newChatList });
            }else{
                //found = true, and user is receiver
                const newChatList = [
                    {...found, lastMessage, unreadCount},
                    ...chatList.filter(c => c._id !== data.conversation._id)
                ];
                
                useUserStore.setState({ chatList: newChatList });
            }
        }else{
            //if chatList not found
            useUserStore.setState({ chatList: [data.conversation, ...chatList] });
            useMessageStore.getState().setMessages(data.newMsg);
        }
    }
}

export const handleDeliveredMsg = (data) => {
    if(useUserStore.getState().currentOpenConversationId === data.conversationId){
        useMessageStore.getState().updateMessages(data._id, { messageStatus: data.messageStatus, deliveredAt: data.deliveredAt });
    }
}