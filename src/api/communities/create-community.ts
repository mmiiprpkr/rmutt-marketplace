import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useCreateCommunity = () => {
   const createCommunity = useMutation({
      mutationFn: useConvexMutation(api.communities.createCommunity)
   });

   return createCommunity;
};
