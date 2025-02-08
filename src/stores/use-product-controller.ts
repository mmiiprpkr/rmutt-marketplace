import { create } from "zustand";
import { Id } from "../../convex/_generated/dataModel";

// Define action types as constants
const ACTIONS = {
   CREATE: "create",
   UPDATE: "update",
} as const;

type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

// Define state interface
interface ProductState {
   type: ActionType;
   productId: Id<"products"> | null;
   isOpen: boolean;
}

// Define actions interface
interface ProductActions {
   onOpen: (productId: Id<"products"> | null, type: ActionType) => void;
   onClose: (open: boolean) => void;
}

// Combine state and actions
type ProductController = ProductState & ProductActions;

// Initialize default state
const initialState: ProductState = {
   type: ACTIONS.CREATE,
   productId: null,
   isOpen: false,
};

export const useProductController = create<ProductController>((set) => ({
   ...initialState,
   onOpen: (productId: Id<"products"> | null, type: ActionType) =>
      set({ isOpen: true, productId, type }),
   onClose: () => set({ ...initialState }),
}));
