import { create } from 'zustand';
import axios from 'axios';

import useGlobalStore from "./globalStore.js"
import useAppStore from "./appStore.js"

const useMessageStore = create((set, get) => ({
  messages: [],
  isLoading: false,

  setMessages: (value) => {
    set((state) => ({ messages: [...state.messages, value] }));
  },

  updateMessages: (id, value) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === id ? { ...m, ...value } : m,
      ),
    }));
  },

  fetchAllMessage: async (otherUser) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/message/messages/${otherUser}`,
        {
          withCredentials: true,
        },
      );
      set({ messages: response.data.data.messages });
    } catch (error) {
      console.log(error.message);
      set({ messages: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  sendAMessage: async(id, payload) => {
    try{
        set({ isLoading: true });
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/message/send/${id}`, {
            content: {
                textContent: payload
            }
        },{
            withCredentials: true
        });
        get().setMessages(response.data.data.newMsg);
        useGlobalStore.setState({ message: response.data.message });
    }catch(error){
        useAppStore.setState({ errorMessage: error.response.data.error.message });
        console.log("Error in sendAMessage ", error);
    }finally{
        set({ isLoading: false });
    }
  } 
}));

export default useMessageStore;