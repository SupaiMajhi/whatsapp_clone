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
            set({ messages: response.data.data });
        } catch (error) {
            console.log(error.message);
            set({ messages: [] });
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useMessageStore;