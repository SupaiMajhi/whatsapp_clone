import useSocketStore from "./store/socketStore.js"

const socket = useSocketStore((state) => state.socket);

export const onSeen = (messagesIds) => {
    socket.send(JSON.stringify({
        type: 'markAsSeen',
        content: {
            data: messagesIds
        }
    }))
}