import { create } from "zustand";

type CreateCommunityStore = {
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
};

export const useCreateCommunityStore = create<CreateCommunityStore>()(
   (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
   }),
);
