import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,

    handleLogin: async (phone, password) => {
        try {
            set({ isLoading: true });
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                phone,
                password
            }, {withCredentials: true});
            set({ isLoading: false });
            set({ user: response.data.data });
            return response.data.data;
        } catch (error) {
            console.log(error.message);
            set({ isLoading: false });
            set({ user: null });
        }
    },

    handleCheckAuth: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/check-auth`, {
                withCredentials: true
            });
            set({ isLoading: false });
            set({ user: response.data.data });
        } catch (error) {
            console.log(error.message);
            set({ isLoading: false });
            set({ user: null });
        }
    }
}));

export default useAuthStore;