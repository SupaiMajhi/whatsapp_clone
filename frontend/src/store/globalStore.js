import { create } from 'zustand';


const useGlobalStore = create((set) => ({
    error: null,
    message: '',
    redirectURL: null,
    isLoading: false,
    theme: "dark",

    setError: (value) => set(() => ({ error: value })),
    setMessage: (value) => set(() => ({ message: value })),
    setTheme: (value) => set(() => ({ theme: value })),
    setRedirectURL: (value) => set(() => ({ redirectURL: value })),
}));

export default useGlobalStore;