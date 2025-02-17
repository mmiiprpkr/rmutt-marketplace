import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useUpdatePost = () => {
   const updatePost = useMutation({
      mutationFn: useConvexMutation(api.post.updatePost),
   });

   return updatePost;
};
