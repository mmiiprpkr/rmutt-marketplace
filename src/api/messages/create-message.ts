import { api } from "../../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useCreateMessage = () => {
   const createMessage = useMutation({
      mutationFn: useConvexMutation(api.messages.createMessage),
   });

   return createMessage;
};
