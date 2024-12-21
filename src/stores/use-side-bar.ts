import { create } from "zustand";

type SideBarStore = {
   isOpen: boolean;
   onOpen: () => void;
   onClose: (isOpen: boolean) => void;
};

export const useSideBarStore = create<SideBarStore>((set) => ({
   isOpen: false,
   onOpen: () => set({ isOpen: true }),
   onClose: (isOpen: boolean) => set({ isOpen }),
}));
