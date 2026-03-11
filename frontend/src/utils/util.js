

import useSocketStore from "../store/socketStore.js"

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