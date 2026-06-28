import { create } from "zustand"

const useAppStore = create((set) => ({
    isChatSelected: false,
    currentRcvr: null,
    errorMessage: '',
    userInfo: null,
    isProfileComplete: false,
    showOverlay: false,
    isPopUpVisible: false,

    setIsChatSelected: (value) => {
        set({ isChatSelected: value });
    },

    setCurrentRcvr: (value) => {
        set({ currentRcvr: value });
    },

    setShowOverlay: (value) => {
        set({ showOverlay: value });
    },

    setIsPopUpVisible: (value) => {
        set({ isPopUpVisible: value });
    }
}));

export default useAppStore;