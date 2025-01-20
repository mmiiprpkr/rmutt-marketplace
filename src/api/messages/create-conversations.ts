import { api } from "../../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useConversations = () => {
   const conversations = useMutation({
      mutationFn: useConvexMutation(api.messages.conversations),
   });

   return conversations;
};
