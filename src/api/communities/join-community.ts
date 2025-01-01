import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useJoinCommunity = () => {
   const joinCommunity = useMutation({
      mutationFn: useConvexMutation(api.communities.joinCommunity),
   });

   return joinCommunity;
};
