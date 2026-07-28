import { create } from "zustand";
import axios from "axios";

import useAppStore from "./appStore.js";

const useUserStore = create((set) => ({

    chatList: [],
    userStatus: null,
    currentOpenConversation: {
      conversationId: null,
      userId: null,
    },
    isLoading: true,

    setCurrentOpenConversation: (value) => {
        set({ currentOpenConversation: value });
    },

    getPrevChatList: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/chatlist`, {
                withCredentials: true
            });
            set({ chatList: response.data.data.chatlist });
        } catch (error) {
            console.log(error.response);
            useAppStore.setState({ errorMessage: error.response.data.error.message });
            set({ chatList: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    getUserStatus: async (userId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/status/${userId}`, {
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
    },

    searchUser: async (phone) => {
        try {
           set({ isLoading: true });
           const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/user/search`, 
            {
                content: {
                    phone,
                }
            }, 
            { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.log('Error in searchUser', error.message);
            return {};
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useUserStore;
