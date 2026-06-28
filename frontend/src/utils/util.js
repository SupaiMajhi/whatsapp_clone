import useSocketStore from "../store/socketStore.js"

const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const onSeen = (messagesIds) => {
    const socket = useSocketStore.getState()?.socket;
    if(socket?.readyState === WebSocket.OPEN){
        socket?.send(JSON.stringify({
            type: 'markAsSeen',
            content: {
                data: messagesIds
            }
        }))
    }
}

export const sendMessageViaSocket = (msgType, content) => {
    const socket = useSocketStore.getState()?.socket;
    if(socket?.readyState === WebSocket.OPEN){    
        console.log('sent');
        socket?.send(JSON.stringify({
            type: msgType,
            content
        }));
    }
}

export const formatChatTime = (time) => {
    const now = new Date();
    const chatTime = new Date(time);

    const diff = now.getDate() - chatTime.getDate();

    if(diff === 0){
        return chatTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    } else if(diff === 1){

        return "Yesterday";
    } else if(diff > 1 && diff < 7){

        const dayVal = chatTime.getDay();
        return dayNames[dayVal];
    } else if(diff > 6){

        return chatTime.toLocaleDateString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    } else {
        return "NaN"
    }
}

export const formatMessageTime = (time) => {
    const msgTime = new Date(time);
    const now = new Date();

    if(msgTime.toDateString() === now.toDateString()){
        return msgTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if(yesterday.toDateString() === msgTime.toDateString()){
        return 'Yesterday';
    }

    return 'NaN';
}
