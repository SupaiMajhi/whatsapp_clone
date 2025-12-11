import { create } from 'zustand';
import axios from 'axios';

const useMessageStore = create((set) => ({
    messages: [],
    isLoading: false,

    fetchAllMessage: async (otherUser) => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/get-all-message/${otherUser}`, {
                withCredentials: true
            });
            set({ isLoading: false });
            set({ messages: response.data.data });
        } catch (error) {
            console.log(error.message);
            set({ isLoading: false });
            set({ messages: [] });
        }
    },

    updateMessages: (msg) => {
        set((state) => ({ messages: [...state.messages, msg] }));
    },

    onDelivered: (data) => set((state) => ({
        messages: state.messages.map((m) => m._id === data._id ? { ...m, isDelivered:data.isDelivered, deliveredAt:data.deliveredAt } : m)
    })),

    onSeen: (data) => set((state) => {
        const updated = state.messages.map((msg) => {
            const found = data.find(d => d._id === msg._id);
            return found ? {...msg, isSeen: found.isSeen, readAt: found.readAt } : msg;
        });
        return { messages: updated }

        // messages: state.messages.map((msg) => msg._id === data._id ? { ...msg, isSeen: data.isSeen, readAt: data.readAt } : msg )
    }),

    // onOfflineMessage = (data) => set

    sendAMessage: async (receiverId, text) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/message/send-message/${receiverId}`, {
                text
            }, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.log(error.message);
            set({ isLoading: false });
            return;
        }
    }
}));

export default useMessageStore;