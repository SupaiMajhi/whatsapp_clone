import { create } from "zustand";
import useMessageStore from "./messageStore.js";

const useSocketStore = create((set, get) => ({
    socket: null,

    connect: () => {
        const ws = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}`);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if(message.type === 'NEW_MSG'){
                const { updateMessages } = useMessageStore.getState();
                updateMessages(message.content.data);
                ws.send(
                  JSON.stringify({
                    type: "markAsDelivered",
                    content: {
                      data: message.content.data,
                      time: Date.now(),
                    },
                  })
                );
            }

            if(message.type === 'msg_delivered'){
                const {onDelivered} = useMessageStore.getState();
                onDelivered(message.content.data);
            }

            if(message.type === 'msg_seen'){
                const {onSeen} = useMessageStore.getState();
                onSeen(message.content.data);
                //message.content.data is an array
                //messages is also an array
            }
        }
        set({ socket: ws });
    }
}));


export default useSocketStore;