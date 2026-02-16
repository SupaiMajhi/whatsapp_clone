import { create } from "zustand"

const useAppStore = create((set) => ({
    isChatSelected: false,

    setIsChatSelected: (value) => {
        set({ isSelected: value });
    }
}));

export default useAppStore;