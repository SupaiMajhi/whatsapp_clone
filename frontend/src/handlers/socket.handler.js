
import useUserStore from "../store/userStore.js"

export const handleOfflineMsg = (data) => {
    data.forEach(d => {
        const { chatList } = useUserStore.getState();
        const lastMessage = d.messages.at(-1);
        const unreadCount = d.messages.length;

        const index = chatList.findIndex(c => c._id === d._id);
        if(index !== -1){
            const updateList = [...chatList];
            updateList[index] = {
                ...updateList[index],
                lastMessage,
                unreadCount
            }
            useUserStore.setState({ chatList: [updateList[index], ...updateList] });
        }
    });

    //send delivery_ack
    
}