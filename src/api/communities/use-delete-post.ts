import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useDeletePost = () => {
   const deletePost = useMutation({
      mutationFn: useConvexMutation(api.post.deletePost),
   });

   return deletePost;
};
