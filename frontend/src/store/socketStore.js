
import { create } from "zustand";

import { onOfflineMessage } from "../utils/handler.js";

const useSocketStore = create((set, get) => ({
    socket: null,

    connect: () => {
        const ws = new WebSocket(process.env.VITE_SOCKET_URL);

        ws.onopen = () => {
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if(message.type === "offlineMsg"){
                onOfflineMessage(message.content.data);
            }

            if(message.type === "delivered_ack"){

        }

        ws.onerror = (error) => {
            console.log('client WebSocket error ', error);
        }

        ws.onclose = () => {
        }

        set({ socket:ws });
    },

    disconnect: () => {
        if(get().socket?.readyState !== WebSocket.CLOSED){
            get().socket?.close();
        }
        set({ socket:null });
    }

}));


export default useSocketStore;