import { create } from "zustand";

import useMessageStore from "./messageStore.js";

const useSocketStore = create((set, get) => ({
    socket: null,

    connect: () => {
        const ws = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}`);

        ws.onerror = (error) => {
            console.log('socket error', error);
        }
        
        set({ socket: ws });
    },

    disconnect: () => {
        if(get().socket?.readyState === "CLOSING" || get().socket?.readyState === "CLOSED"){
            get().socket?.close();
        }
        set({ socket: null });
    }
}));


export default useSocketStore;