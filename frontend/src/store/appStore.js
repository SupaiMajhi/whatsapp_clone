import { create } from "zustand"

const useAppStore = create((set) => ({
    isChatSelected: false,
    currentRcvr: null,
    errorMessage: '',

    setIsChatSelected: (value) => {
        set({ isChatSelected: value });
    },

    setCurrentRcvr: (value) => {
        set({ currentRcvr: value });
    }
}));

export default useAppStore;