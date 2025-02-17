import { api } from "../../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useDeleteMessage = () => {
   const message = useMutation({
      mutationFn: useConvexMutation(api.messages.deleteMessage),
   });

   return message;
};
