import { create } from "zustand";
import axios from "axios";

import useAppStore from "./appStore.js";

const useUserStore = create((set) => ({
    prevChatList: [],
    userStatus: null,
    isLoading: false,

    getPrevChatList: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/get-chatList`, {
                withCredentials: true
            });
            set({ prevChatList: response.data.data });
        } catch (error) {
            console.log(error.response);
            useAppStore.setState({ errorMessage: error.response.message });
            set({ prevChatList: [] });
        } finally {
            set({ isLoading: false });
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