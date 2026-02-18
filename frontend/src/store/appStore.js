import { create } from "zustand"

const useAppStore = create((set) => ({
    isChatSelected: false,
    currentRcvr: null,
    errorMessage: '',

    setIsChatSelected: (value) => {
        set({ isSelected: value });
    },

    setCurrentRcvr: (value) => {
        set({ currentRcvr: value });
    }
}));

export default useAppStore;