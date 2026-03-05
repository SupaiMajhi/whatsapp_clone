import useSocketStore from "../store/socketStore.js"

const socket = useSocketStore((state) => state.socket);

export const onSeen = (messagesIds) => {
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
    if(socket?.readyState === WebSocket.OPEN){    
        socket?.send(JSON.stringify({
            type: msgType,
            content
        }));
    }
}