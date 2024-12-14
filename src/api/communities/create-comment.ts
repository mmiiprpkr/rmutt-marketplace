import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useCreateComment = () => {
   const createComment = useMutation({
      mutationFn: useConvexMutation(api.communities.createComment)
   });

   return createComment;
};