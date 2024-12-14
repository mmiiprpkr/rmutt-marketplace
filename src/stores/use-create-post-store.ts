import { create } from "zustand";

type CreatePostType = "createPost" | "createPostCommunity";

interface CreatePostStore {
   type: CreatePostType;
   isOpen: boolean;
   onOpen: (type: CreatePostType) => void;
   onClose: (isOpen: boolean) => void;
};

export const useCreatePostStore = create<CreatePostStore>()((set) => ({
   type: "createPost",
   isOpen: false,
   onOpen: (type: CreatePostType) => set({ type, isOpen: true }),
   onClose: (isOpen) => set({ isOpen }),
}));
