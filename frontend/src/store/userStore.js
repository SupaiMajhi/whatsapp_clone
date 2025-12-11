import { create } from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
    prevChatList: [],
    userStatus: null,
    currentRcvr: null,
    
    setCurrentRcvr: (value) => {
        set({ currentRcvr: value });
    },

    getPrevChatList: async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/get-all-chatList`, {
                withCredentials: true
            });
            set({ prevChatList: response.data.data });
        } catch (error) {
            console.log(error.message);
            set({ prevChatList: [] });
        }
    },

    getUserStatus: async (userId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/get-status/${userId}`, {
                withCredentials: true
            });
            set({ userStatus: response.data.data });
        } catch (error) {
            console.log('Error in getUserStatus', error.message);
            set({ userStatus: null});
        }
    },

    updateStatus: (value) => {
        set({ userStatus: value });
    }
}));

export default useUserStore;