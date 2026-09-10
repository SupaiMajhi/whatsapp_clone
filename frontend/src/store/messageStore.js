import { create } from "zustand";
import axios from "axios";

import useGlobalStore from "./globalStore.js";
import useAppStore from "./appStore.js";
import useUserStore from "./userStore.js";

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

  fetchFirstPage: async (conversationId) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/conversations/${conversationId}/messages`,
        {
          withCredentials: true,
        },
      );
      set({ messages: response.data.data.messages });
      useGlobalStore.setState({ cursor: response.data.data.nextCursor });
      useGlobalStore.setState({ hasMore: response.data.data.hasMore });
    } catch (error) {
      console.log(error.message);
      set({ messages: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNextPage: async(conversationId) => {
    const cursor = useGlobalStore.getState()?.cursor;
    if(!cursor) return;
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/conversations/${conversationId}/messages/more`, {
          withCredentials: true,
          params: {
            cursor,
          }
      });
      set((state) => {
        const msg = response.data.data.messages;
        return { messages: [...msg, ...state.messages] }
      });
      useGlobalStore.setState({ cursor: response.data.data.nextCursor });
      useGlobalStore.setState({ hasMore: response.data.data.hasMore });
    } catch (error) {
      console.log("Error in fetchNextPage", error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  sendAMessage: async (id, payload) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/message/send/${id}`,
        {
          content: {
            textContent: payload,
          },
        },
        {
          withCredentials: true,
        },
      );
      get().setMessages(response.data.data.newMsg);
      useGlobalStore.setState({ message: response.data.message });
    } catch (error) {
      useAppStore.setState({ errorMessage: error.response.data.error.message });
      console.log("Error in sendAMessage ", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useMessageStore;
