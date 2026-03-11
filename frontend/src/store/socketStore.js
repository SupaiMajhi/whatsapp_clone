
import { create } from "zustand";

import { handleOnOfflineMsg, handleOnNewMsg } from "../handlers/socket.handler.js";

const useSocketStore = create((set, get) => ({
    socket: null,

    connect: () => {
        const ws = new WebSocket(import.meta.env.VITE_SOCKET_URL);

        ws.onopen = () => {
            set({ socket: ws });
        }

        ws.onmessage = (event) => {
            try{
                const message = JSON.parse(event.data);

                if(message.type === "offline_msg"){
                    handleOnOfflineMsg(message.content.data);
                }

                if(message.type === "new_msg"){
                    handleOnNewMsg(message.content.data);
                }

                if(message.type === "delivered_ack"){
                    handleDeliveredMsg(message.content.data);
                }

                if(message.type === "seen_ack"){
                    handleSeenMsg(message.content.data);
                }
            } catch(err) {
                console.log('invalid ws message', err.message);
            }
        }

        ws.onerror = (error) => {
            console.log('client WebSocket error ', error);
        }

        ws.onclose = () => {
            set({ socket: null });
        }
    },

    disconnect: () => {
        if(get().socket?.readyState !== WebSocket.CLOSED){
            get().socket?.close();
        }
        set({ socket:null });
    }

}));


export default useSocketStore;